import json
from bson import ObjectId
from services.db import db
from tools.utils import serialize_doc

def register_registration_tools(mcp):
    @mcp.tool()
    def list_registrations(event_id: str) -> str:
        """Returns a list of attendees with name, email, and RSVP status for an event."""
        try:
            rsvps = list(db.rsvps.find({"event": ObjectId(event_id)}))
            serialized = []
            for r in rsvps:
                r = serialize_doc(r)
                serialized.append({
                    "id": r["_id"],
                    "name": r.get("name"),
                    "email": r.get("email"),
                    "status": r.get("status"),
                    "createdAt": r.get("createdAt")
                })
            return json.dumps(serialized, indent=2)
        except Exception as e:
            return json.dumps({"error": str(e)})

    @mcp.tool()
    def get_registration_summary(event_id: str) -> str:
        """Returns a summary of registrations for an event (total, approved, pending, rejected, revoked)."""
        try:
            pipeline = [
                {"$match": {"event": ObjectId(event_id)}},
                {"$group": {"_id": "$status", "count": {"$sum": 1}}}
            ]
            results = list(db.rsvps.aggregate(pipeline))
            
            summary = {
                "total": 0,
                "approved": 0,
                "pending": 0,
                "rejected": 0,
                "revoked": 0,
                "registered": 0
            }
            
            for r in results:
                status = r["_id"]
                count = r["count"]
                if status in summary:
                    summary[status] = count
                summary["total"] += count
                
            return json.dumps(summary, indent=2)
        except Exception as e:
            return json.dumps({"error": str(e)})

    @mcp.tool()
    def update_registration_status(registration_id: str, new_status: str) -> str:
        """Updates RSVP status safely."""
        valid_statuses = ["pending", "registered", "approved", "rejected", "revoked"]
        if new_status not in valid_statuses:
            return json.dumps({"error": f"Invalid status. Must be one of {valid_statuses}"})
            
        try:
            result = db.rsvps.update_one(
                {"_id": ObjectId(registration_id)},
                {"$set": {"status": new_status}}
            )
            if result.modified_count == 0:
                return json.dumps({"error": "Registration not found or status already set to this value"})
                
            return json.dumps({"success": True, "message": f"Status updated to {new_status}"})
        except Exception as e:
            return json.dumps({"error": str(e)})
