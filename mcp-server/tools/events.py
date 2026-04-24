import json
from datetime import datetime, timezone
from bson import ObjectId
from services.db import db
from tools.utils import serialize_doc
from config.settings import DEFAULT_ORGANIZER_ID


def _normalize_event_status(status):
    if status == "published":
        return "live"
    return status or "unknown"


def _build_event_payload(events):
    serialized_events = []
    status_counts = {
        "draft": 0,
        "live": 0,
        "cancelled": 0,
    }

    for event in events:
        serialized = serialize_doc(event)
        if serialized is None:
            continue

        status_label = _normalize_event_status(serialized.get("status"))
        serialized["statusLabel"] = status_label
        serialized_events.append(serialized)

        if status_label in status_counts:
            status_counts[status_label] += 1
        else:
            status_counts[status_label] = status_counts.get(status_label, 0) + 1

    return {
        "asOf": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "total": len(serialized_events),
        "statusCounts": status_counts,
        "events": serialized_events,
    }


def _to_object_id(value):
    if isinstance(value, ObjectId):
        return value
    return ObjectId(str(value))


def _resolve_event_query(organizer_id=None):
    if organizer_id:
        return {"organizer": _to_object_id(organizer_id)}, {
            "organizerId": str(organizer_id),
            "source": "argument",
        }

    if DEFAULT_ORGANIZER_ID:
        return {"organizer": _to_object_id(DEFAULT_ORGANIZER_ID)}, {
            "organizerId": DEFAULT_ORGANIZER_ID,
            "source": "default_env",
        }

    distinct_organizers = list(db.events.distinct("organizer"))
    if len(distinct_organizers) == 1:
        organizer = distinct_organizers[0]
        organizer_oid = _to_object_id(organizer)
        return {"organizer": organizer_oid}, {
            "organizerId": str(organizer_oid),
            "source": "auto_single_organizer",
        }

    return {}, {
        "organizerId": None,
        "source": "all_organizers",
    }

def register_event_tools(mcp):
    @mcp.tool()
    def list_events(organizer_id: str = None) -> str:
        """Always queries MongoDB fresh and returns exact totals/status counts for the resolved organizer scope."""
        try:
            query, scope = _resolve_event_query(organizer_id)
        except Exception:
            return json.dumps({"error": "Invalid organizer_id format"})
                
        try:
            events = list(db.events.find(query).sort([("updatedAt", -1), ("createdAt", -1)]))
            payload = _build_event_payload(events)
            payload["scope"] = scope
            return json.dumps(payload, indent=2)
        except Exception as e:
            return json.dumps({"error": str(e)})

    @mcp.tool()
    def get_event_summary(organizer_id: str = None) -> str:
        """Always queries MongoDB fresh and returns exact event counts for the resolved organizer scope."""
        try:
            query, scope = _resolve_event_query(organizer_id)
        except Exception:
            return json.dumps({"error": "Invalid organizer_id format"})

        try:
            events = list(db.events.find(query).sort([("updatedAt", -1), ("createdAt", -1)]))
            payload = _build_event_payload(events)
            return json.dumps(
                {
                    "asOf": payload["asOf"],
                    "scope": scope,
                    "total": payload["total"],
                    "statusCounts": payload["statusCounts"],
                },
                indent=2,
            )
        except Exception as e:
            return json.dumps({"error": str(e)})

    @mcp.tool()
    def get_event(event_id: str) -> str:
        """Returns full event details given an event_id."""
        try:
            event = db.events.find_one({"_id": ObjectId(event_id)})
            if not event:
                return json.dumps({"error": "Event not found"})
            serialized = serialize_doc(event)
            serialized["statusLabel"] = _normalize_event_status(serialized.get("status"))
            return json.dumps(serialized, indent=2)
        except Exception as e:
            return json.dumps({"error": str(e)})

    @mcp.tool()
    def get_live_event_details(organizer_id: str = None) -> str:
        """Always queries MongoDB fresh and returns the most recently updated live (published) event for the resolved organizer scope."""
        try:
            query, scope = _resolve_event_query(organizer_id)
        except Exception:
            return json.dumps({"error": "Invalid organizer_id format"})

        query["status"] = "published"

        try:
            live_event = db.events.find_one(query, sort=[("updatedAt", -1), ("createdAt", -1)])
            if not live_event:
                return json.dumps(
                    {
                        "asOf": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                        "scope": scope,
                        "liveEvent": None,
                        "message": "No live event found for the resolved scope.",
                    },
                    indent=2,
                )

            serialized = serialize_doc(live_event)
            serialized["statusLabel"] = _normalize_event_status(serialized.get("status"))
            return json.dumps(
                {
                    "asOf": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                    "scope": scope,
                    "liveEvent": serialized,
                },
                indent=2,
            )
        except Exception as e:
            return json.dumps({"error": str(e)})
