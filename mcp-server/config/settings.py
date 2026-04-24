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
DEFAULT_ORGANIZER_ID = os.getenv("DEFAULT_ORGANIZER_ID", "").strip() or None
DEFAULT_ORGANIZER_EMAIL = os.getenv("DEFAULT_ORGANIZER_EMAIL", "").strip().lower() or None
REQUIRE_EXPLICIT_ORGANIZER_SCOPE = (
	os.getenv("REQUIRE_EXPLICIT_ORGANIZER_SCOPE", "true").strip().lower()
	in ("1", "true", "yes", "on")
)
