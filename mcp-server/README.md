# EventFlow MCP Server

This is an MCP (Model Context Protocol) server that provides AI assistants with access to the EventFlow MongoDB database.

## Architecture

This service is entirely decoupled from the Express backend and connects directly to the MongoDB database using `pymongo`. It uses the official `mcp` SDK via `FastMCP`.

## Setup

1. Make sure you have Python 3.10+ installed.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   Copy `.env.example` to `.env` and configure your `MONGODB_URI`.
   ```bash
   cp .env.example .env
   ```

## Running the Server

### For Claude Desktop App / Other MCP Clients
You can add this server to your Claude Desktop config (`claude_desktop_config.json`) like this:

```json
{
  "mcpServers": {
    "eventflow": {
      "command": "/absolute/path/to/venv/bin/python",
      "args": ["/absolute/path/to/EventFlow/mcp-server/server.py"]
    }
  }
}
```

### Standalone / Testing
Run directly (it will wait for MCP JSON-RPC messages on stdin):
```bash
python server.py
```

## Available Tools

- `list_events`: List all events in the system (optionally filter by `organizer_id`).
- `get_event`: Get full details for a specific event.
- `list_registrations`: List all attendees for a specific event.
- `get_registration_summary`: Get a breakdown of registration statuses (approved, pending, etc.).
- `update_registration_status`: Update an attendee's status.
