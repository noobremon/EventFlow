from bson import ObjectId
from datetime import timezone


def _serialize_datetime(value):
    if not hasattr(value, "isoformat"):
        return value

    dt = value
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)

    return dt.isoformat().replace("+00:00", "Z")

def serialize_doc(doc):
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])
    if "organizer" in doc and isinstance(doc["organizer"], ObjectId):
        doc["organizer"] = str(doc["organizer"])
    if "event" in doc and isinstance(doc["event"], ObjectId):
        doc["event"] = str(doc["event"])
    if "createdAt" in doc:
        doc["createdAt"] = _serialize_datetime(doc["createdAt"])
    if "updatedAt" in doc:
        doc["updatedAt"] = _serialize_datetime(doc["updatedAt"])
    if "dateTime" in doc:
        doc["dateTime"] = _serialize_datetime(doc["dateTime"])
    return doc
