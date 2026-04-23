from bson import ObjectId

def serialize_doc(doc):
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])
    if "organizer" in doc and isinstance(doc["organizer"], ObjectId):
        doc["organizer"] = str(doc["organizer"])
    if "event" in doc and isinstance(doc["event"], ObjectId):
        doc["event"] = str(doc["event"])
    if "createdAt" in doc and hasattr(doc["createdAt"], "isoformat"):
        doc["createdAt"] = doc["createdAt"].isoformat()
    if "updatedAt" in doc and hasattr(doc["updatedAt"], "isoformat"):
        doc["updatedAt"] = doc["updatedAt"].isoformat()
    if "dateTime" in doc and hasattr(doc["dateTime"], "isoformat"):
        doc["dateTime"] = doc["dateTime"].isoformat()
    return doc
