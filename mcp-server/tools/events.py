import json
import re
from datetime import datetime, timezone
from bson import ObjectId
from services.db import db
from tools.utils import serialize_doc
from config.settings import (
    DEFAULT_ORGANIZER_ID,
    DEFAULT_ORGANIZER_EMAIL,
    REQUIRE_EXPLICIT_ORGANIZER_SCOPE,
)


LAST_CREATED_EVENT_CONTEXT = {
    "asOf": None,
    "eventId": None,
    "eventTitle": None,
    "organizerId": None,
    "organizerEmail": None,
}


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


def _slugify(value):
    slug = re.sub(r"[^a-z0-9]+", "-", str(value).strip().lower()).strip("-")
    return slug or "event"


def _ensure_unique_slug(base_slug):
    slug = base_slug
    index = 2
    while db.events.find_one({"slug": slug}, {"_id": 1}) is not None:
        slug = f"{base_slug}-{index}"
        index += 1
    return slug


def _parse_event_datetime(value):
    if not value:
        raise ValueError("date_time is required")

    text = str(value).strip()
    normalized = text.replace("Z", "+00:00")
    parsed = datetime.fromisoformat(normalized)

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    else:
        parsed = parsed.astimezone(timezone.utc)

    return parsed


def _lookup_organizer_by_email(organizer_email):
    if not organizer_email:
        return None

    normalized_email = str(organizer_email).strip().lower()
    if not normalized_email:
        return None

    organizer_user = db.users.find_one(
        {"email": normalized_email},
        {"_id": 1},
    )
    if organizer_user and organizer_user.get("_id"):
        return organizer_user["_id"]

    return None


def _resolve_event_query(organizer_email=None, organizer_id=None, require_explicit_email=False):
    # Backward compatibility: some clients still expose only organizer_id.
    # If it looks like an email, treat it as organizer_email.
    if not organizer_email and organizer_id and "@" in str(organizer_id):
        organizer_email = str(organizer_id)

    if organizer_email:
        organizer_oid = _lookup_organizer_by_email(organizer_email)
        if organizer_oid:
            return {"organizer": _to_object_id(organizer_oid)}, {
                "organizerEmail": str(organizer_email).strip().lower(),
                "organizerId": str(organizer_oid),
                "source": "argument_email",
            }
        return None, {
            "organizerEmail": str(organizer_email).strip().lower(),
            "source": "email_not_found",
            "message": "No organizer matches the provided email.",
        }

    if organizer_id:
        try:
            organizer_oid = _to_object_id(organizer_id)
            return {"organizer": organizer_oid}, {
                "organizerId": str(organizer_oid),
                "source": "argument_id",
            }
        except Exception:
            return None, {
                "organizerId": str(organizer_id),
                "source": "invalid_organizer_id",
                "message": "organizer_id is neither a valid email nor a valid ObjectId.",
            }

    if DEFAULT_ORGANIZER_ID:
        return {"organizer": _to_object_id(DEFAULT_ORGANIZER_ID)}, {
            "organizerId": DEFAULT_ORGANIZER_ID,
            "source": "default_env",
        }

    if DEFAULT_ORGANIZER_EMAIL:
        organizer_oid = _lookup_organizer_by_email(DEFAULT_ORGANIZER_EMAIL)
        if organizer_oid:
            return {"organizer": organizer_oid}, {
                "organizerEmail": DEFAULT_ORGANIZER_EMAIL,
                "organizerId": str(organizer_oid),
                "source": "default_email",
            }

    if require_explicit_email:
        return None, {
            "organizerId": None,
            "organizerEmail": None,
            "source": "email_required_for_create",
            "message": "Provide organizer_email to create an event for the correct admin account.",
        }

    if REQUIRE_EXPLICIT_ORGANIZER_SCOPE:
        return None, {
            "organizerId": None,
            "organizerEmail": None,
            "source": "email_required",
            "message": "Provide organizer_email. Email is the only supported lookup key for multi-admin resolution.",
        }

    return {}, {
        "organizerId": None,
        "organizerEmail": None,
        "source": "all_organizers_fallback",
    }

def register_event_tools(mcp):
    @mcp.tool()
    def create_event(
        title: str,
        date_time: str,
        venue: str,
        organizer_email: str = None,
        organizer_id: str = None,
    ) -> str:
        """Creates a draft event from minimal details (title, date_time, venue) and fills remaining fields with TBD/default values."""
        if not title or not str(title).strip():
            return json.dumps({"error": "title is required"}, indent=2)
        if not date_time or not str(date_time).strip():
            return json.dumps({"error": "date_time is required"}, indent=2)
        if not venue or not str(venue).strip():
            return json.dumps({"error": "venue is required"}, indent=2)

        try:
            query, scope = _resolve_event_query(
                organizer_email,
                organizer_id,
                require_explicit_email=True,
            )
        except Exception:
            return json.dumps({"error": "Invalid organizer_email/organizer_id format"}, indent=2)

        if query is None or "organizer" not in query:
            return json.dumps(
                {
                    "error": "Organizer scope required",
                    "scope": scope,
                },
                indent=2,
            )

        try:
            event_dt = _parse_event_datetime(date_time)
        except Exception:
            return json.dumps(
                {
                    "error": "Invalid date_time. Use an ISO format like 2026-06-01T18:30:00Z.",
                },
                indent=2,
            )

        try:
            base_slug = _slugify(title)
            slug = _ensure_unique_slug(base_slug)

            doc = {
                "organizer": query["organizer"],
                "title": str(title).strip(),
                "slug": slug,
                "description": "TBD",
                "dateTime": event_dt,
                "venue": str(venue).strip(),
                "isOnline": False,
                "onlineLink": "",
                "capacity": 50,
                "registrationMode": "open",
                "status": "draft",
                "registeredCount": 0,
                "createdAt": datetime.now(timezone.utc),
                "updatedAt": datetime.now(timezone.utc),
            }

            result = db.events.insert_one(doc)
            created = db.events.find_one({"_id": result.inserted_id})
            serialized = serialize_doc(created)
            serialized["statusLabel"] = _normalize_event_status(serialized.get("status"))

            LAST_CREATED_EVENT_CONTEXT["asOf"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
            LAST_CREATED_EVENT_CONTEXT["eventId"] = serialized.get("_id")
            LAST_CREATED_EVENT_CONTEXT["eventTitle"] = serialized.get("title")
            LAST_CREATED_EVENT_CONTEXT["organizerId"] = scope.get("organizerId")
            LAST_CREATED_EVENT_CONTEXT["organizerEmail"] = scope.get("organizerEmail")

            return json.dumps(
                {
                    "success": True,
                    "database": db.name,
                    "scope": scope,
                    "event": serialized,
                },
                indent=2,
            )
        except Exception as e:
            return json.dumps({"error": str(e)}, indent=2)

    @mcp.tool()
    def get_create_event_diagnostics(organizer_email: str = None, organizer_id: str = None) -> str:
        """Returns MCP sync diagnostics: DB name, resolved organizer scope, and latest created event for that scope."""
        try:
            query, scope = _resolve_event_query(organizer_email, organizer_id)
        except Exception:
            return json.dumps({"error": "Invalid organizer_email/organizer_id format"}, indent=2)

        if query is None:
            return json.dumps(
                {
                    "error": "Organizer scope required",
                    "scope": scope,
                },
                indent=2,
            )

        latest_event_doc = db.events.find_one(
            query,
            sort=[("createdAt", -1), ("updatedAt", -1), ("_id", -1)],
        )
        latest_event = serialize_doc(latest_event_doc) if latest_event_doc else None

        if latest_event is not None:
            latest_event = {
                "eventId": latest_event.get("_id"),
                "title": latest_event.get("title"),
                "status": latest_event.get("status"),
                "dateTime": latest_event.get("dateTime"),
                "createdAt": latest_event.get("createdAt"),
            }

        return json.dumps(
            {
                "asOf": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                "database": db.name,
                "resolvedScope": scope,
                "latestEventForScope": latest_event,
                "lastCreatedFromMcp": LAST_CREATED_EVENT_CONTEXT,
            },
            indent=2,
        )

    @mcp.tool()
    def list_events(organizer_email: str = None, organizer_id: str = None) -> str:
        """Always queries MongoDB fresh and returns exact totals/status counts for the resolved organizer scope."""
        try:
            query, scope = _resolve_event_query(organizer_email, organizer_id)
        except Exception:
            return json.dumps({"error": "Invalid organizer_email/organizer_id format"})

        if query is None:
            return json.dumps(
                {
                    "error": "Organizer scope required",
                    "scope": scope,
                },
                indent=2,
            )
                
        try:
            events = list(db.events.find(query).sort([("updatedAt", -1), ("createdAt", -1)]))
            payload = _build_event_payload(events)
            payload["scope"] = scope
            return json.dumps(payload, indent=2)
        except Exception as e:
            return json.dumps({"error": str(e)})

    @mcp.tool()
    def get_event_summary(organizer_email: str = None, organizer_id: str = None) -> str:
        """Always queries MongoDB fresh and returns exact event counts for the resolved organizer scope."""
        try:
            query, scope = _resolve_event_query(organizer_email, organizer_id)
        except Exception:
            return json.dumps({"error": "Invalid organizer_email/organizer_id format"})

        if query is None:
            return json.dumps(
                {
                    "error": "Organizer scope required",
                    "scope": scope,
                },
                indent=2,
            )

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
    def get_live_event_details(organizer_email: str = None, organizer_id: str = None) -> str:
        """Always queries MongoDB fresh and returns the most recently updated live (published) event for the resolved organizer scope."""
        try:
            query, scope = _resolve_event_query(organizer_email, organizer_id)
        except Exception:
            return json.dumps({"error": "Invalid organizer_email/organizer_id format"})

        if query is None:
            return json.dumps(
                {
                    "error": "Organizer scope required",
                    "scope": scope,
                },
                indent=2,
            )

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

    @mcp.tool()
    def get_event_scope_diagnostics() -> str:
        """Returns scope resolution diagnostics to verify Web/Desktop are using the same organizer context."""
        try:
            query, scope = _resolve_event_query(None, None)
            organizer_count = len(list(db.events.distinct("organizer")))
            return json.dumps(
                {
                    "asOf": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                    "requireExplicitScope": REQUIRE_EXPLICIT_ORGANIZER_SCOPE,
                    "defaults": {
                        "organizerId": DEFAULT_ORGANIZER_ID,
                        "organizerEmail": DEFAULT_ORGANIZER_EMAIL,
                    },
                    "resolvedScope": scope,
                    "queryResolved": query is not None,
                    "distinctOrganizerCount": organizer_count,
                    "note": "Use organizer_email only; id lookup is disabled.",
                },
                indent=2,
            )
        except Exception as e:
            return json.dumps({"error": str(e)})
