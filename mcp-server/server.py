import os
import sys

# Add the current directory to sys.path so we can import our modules easily
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mcp.server.fastmcp import FastMCP
from tools.events import register_event_tools
from tools.registrations import register_registration_tools

# Initialize FastMCP server
# We name it "EventFlow"
mcp = FastMCP("EventFlow")

# Register all tools
register_event_tools(mcp)
register_registration_tools(mcp)

if __name__ == "__main__":
    # MCP communicates via stdin/stdout by default
    mcp.run(transport='stdio')
