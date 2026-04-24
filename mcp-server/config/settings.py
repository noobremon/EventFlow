import os
from dotenv import load_dotenv

load_dotenv()

# If MCP-specific env is missing, reuse backend env so both surfaces read the same DB.
BACKEND_ENV_PATH = os.path.join(
	os.path.dirname(__file__),
	"..",
	"..",
	"backend",
	".env",
)
if os.path.exists(BACKEND_ENV_PATH):
	load_dotenv(BACKEND_ENV_PATH, override=False)

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/event-platform")
