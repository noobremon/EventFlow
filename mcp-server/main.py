import os
import sys

# Add the current directory to sys.path so we can import our modules easily
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import google.generativeai as genai
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from mcp.server.fastmcp import FastMCP
from tools.events import register_event_tools
from tools.registrations import register_registration_tools

# Configure Gemini API
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

port = int(os.environ.get("PORT", 8000))

# Initialize FastMCP server
# We name it "EventFlow"
mcp = FastMCP("EventFlow", host="0.0.0.0", port=port)

# Register all tools
register_event_tools(mcp)
register_registration_tools(mcp)

# Create the SSE app
app = mcp.sse_app()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add health check endpoint
async def health(request):
    return JSONResponse({"status": "ok", "server": "Eventflow MCP", "ai": "Gemini"})

app.add_route("/health", health, methods=["GET"])

if __name__ == "__main__":
    import uvicorn
    # If run with --stdio (e.g. from Claude Desktop), use stdio transport
    if len(sys.argv) > 1 and sys.argv[1] == "--stdio":
        mcp.run(transport='stdio')
    else:
        # Otherwise, run the server with SSE transport
        uvicorn.run("main:app", host="0.0.0.0", port=port)
