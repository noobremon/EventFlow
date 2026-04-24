import json
from datetime import datetime, timezone
from bson import ObjectId
from services.db import db
from tools.utils import serialize_doc


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

def register_event_tools(mcp):
    @mcp.tool()
    def list_events(organizer_id: str = None) -> str:
        """Returns all events for an organizer or system with an exact total and status breakdown."""
        query = {}
        if organizer_id:
            try:
                query["organizer"] = ObjectId(organizer_id)
            except Exception:
                return json.dumps({"error": "Invalid organizer_id format"})
                
        try:
            events = list(db.events.find(query).sort([("updatedAt", -1), ("createdAt", -1)]))
            payload = _build_event_payload(events)
            return json.dumps(payload, indent=2)
        except Exception as e:
            return json.dumps({"error": str(e)})

    @mcp.tool()
    def get_event_summary(organizer_id: str = None) -> str:
        """Returns exact counts for events by status plus the total number of events."""
        query = {}
        if organizer_id:
            try:
                query["organizer"] = ObjectId(organizer_id)
            except Exception:
                return json.dumps({"error": "Invalid organizer_id format"})

        try:
            events = list(db.events.find(query).sort([("updatedAt", -1), ("createdAt", -1)]))
            payload = _build_event_payload(events)
            return json.dumps(
                {
                    "asOf": payload["asOf"],
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
