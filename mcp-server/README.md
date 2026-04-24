# EventFlow Platform & AI Assistant

Welcome to the EventFlow Platform!

## 🌐 Main Application
You can access your main event management dashboard and application here:
**[https://event-platform-frontend-xl9s.onrender.com](https://event-platform-frontend-xl9s.onrender.com)**

## 🤖 AI Assistant Setup (Claude Desktop)
We have built a custom AI integration that allows you to manage your events and attendees using plain English via Claude Desktop. 

### How to connect Claude Desktop to your database:
1. Download and install the free **Claude Desktop** app from [claude.ai/download](https://claude.ai/download).
2. Open the Claude Desktop configuration file on your computer:
   - **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
3. Paste the following configuration exactly as shown (this securely connects Claude to your EventFlow AI server):

```json
{
  "mcpServers": {
    "eventflow": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@latest",
        "https://eventflow-jp3o.onrender.com/sse"
      ]
    }
  }
}
```

4. Restart Claude Desktop completely. 
5. You should now see a small **plug icon** 🔌 near your chat bar. 

### What you can ask Claude:
- *"List all my events."*
- *"Show me the details for event X."*
- *"How many people are registered for my upcoming event?"*
- *"Give me a summary of all pending registrations."*
- *"Update John Doe's registration status to approved."*
- *"Create an event with title, date-time, and venue; keep the rest as TBD."*

### Accurate event counts

Use the `get_event_summary` tool when you need exact event totals. It returns the total number of events plus a status breakdown where `published` is reported as `live` to match the project wording.

For live-event details that must match the latest website state, use `get_live_event_details`. This tool always fetches fresh data from MongoDB.

If your database has multiple organizers, pass `organizer_email` to the tool. Email is the only supported lookup for event tools.
