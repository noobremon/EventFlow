# EventFlow MCP Server

This is an MCP (Model Context Protocol) server that provides AI assistants with access to the EventFlow MongoDB database.

## Architecture

This service connects directly to the MongoDB database using `pymongo`. It is configured to run as a cloud-hosted Server-Sent Events (SSE) web service.

## 🚀 Step 1: Deploy to Render (For the Admin)

To make this available to your client without them needing to install Python:
1. Push this code to GitHub.
2. Go to [Render.com](https://dashboard.render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Use these exact settings:
   - **Root Directory:** `mcp-server`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python server.py`
5. Add your **Environment Variable**:
   - `MONGODB_URI` = (Your production MongoDB connection string)
6. Click **Create Web Service** and wait for it to deploy. You will get a URL like `https://eventflow-mcp.onrender.com`.

## 🤝 Step 2: Handoff to the Client

Once deployed, your client DOES NOT need to download this folder. Just give them these instructions:

1. Download and open the **Claude Desktop** app.
2. Open the Claude Desktop configuration file:
   - Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
3. Paste the following configuration (replace the URL with your actual Render URL + `/sse`):

```json
{
  "mcpServers": {
    "eventflow": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/client-sse",
        "https://YOUR-RENDER-APP-NAME.onrender.com/sse"
      ]
    }
  }
}
```

4. Restart Claude Desktop. The client can now manage events and registrations using plain English!

## Available AI Tools

- `list_events`: List all events in the system.
- `get_event`: Get full details for a specific event.
- `list_registrations`: List all attendees for a specific event.
- `get_registration_summary`: Get a breakdown of registration statuses (approved, pending, etc.).
- `update_registration_status`: Update an attendee's status.
