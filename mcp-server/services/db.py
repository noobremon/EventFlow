from pymongo import MongoClient
from config.settings import MONGO_URI

client = MongoClient(MONGO_URI)
db = None

def get_db():
    # Keep MCP aligned with the app DB. If URI has no db segment, use event-platform.
    default_db = client.get_default_database()
    if default_db is not None:
        return default_db

    return client['event-platform']

db = get_db()
