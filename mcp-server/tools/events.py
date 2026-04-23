import json
from bson import ObjectId
from services.db import db
from tools.utils import serialize_doc

def register_event_tools(mcp):
    @mcp.tool()
    def list_events(organizer_id: str = None) -> str:
        """Returns all events for an organizer or system. Output is a structured JSON array."""
        query = {}
        if organizer_id:
            try:
                query["organizer"] = ObjectId(organizer_id)
            except Exception:
                return json.dumps({"error": "Invalid organizer_id format"})
                
        try:
            events = list(db.events.find(query))
            serialized = [serialize_doc(e) for e in events]
            return json.dumps(serialized, indent=2)
        except Exception as e:
            return json.dumps({"error": str(e)})

    @mcp.tool()
    def get_event(event_id: str) -> str:
        """Returns full event details given an event_id."""
        try:
            event = db.events.find_one({"_id": ObjectId(event_id)})
            if not event:
                return json.dumps({"error": "Event not found"})
            return json.dumps(serialize_doc(event), indent=2)
        except Exception as e:
            return json.dumps({"error": str(e)})
