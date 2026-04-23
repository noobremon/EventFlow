from pymongo import MongoClient
from config.settings import MONGO_URI

client = MongoClient(MONGO_URI)
db = client.get_default_database()

def get_db():
    # If no default database is provided in URI, fallback to 'event-platform'
    if client.get_database().name == 'test' and 'event-platform' not in MONGO_URI:
        return client['event-platform']
    return client.get_database()

db = get_db()
