# 🎉 EventFlow — Mini Event Management Platform

A production-quality event management platform built with **Next.js**, **Express**, **MongoDB**, and **JWT authentication**.

> **Demo note:** This repo includes a hosted Claude Desktop AI endpoint for EventFlow management, as documented below.

## Architecture

```
┌─────────────────┐       ┌──────────────────┐       ┌──────────────┐
│   Next.js App   │──────>│   Express API    │──────>│   MongoDB    │
│  (React + TS)   │ HTTP  │  (Node.js)       │       │              │
│  Port 3000      │       │  Port 5000       │       │  Port 27017  │
└─────────────────┘       └──────────────────┘       └──────────────┘
                                  │
                                  ▼
                          ┌──────────────┐
                          │  SMTP Email  │
                          │  (optional)  │
                          └──────────────┘
```

**Backend architecture** follows clean separation:
- `models/` — Mongoose schemas (User, Event, RSVP)
- `services/` — Business logic layer
- `controllers/` — Thin HTTP handlers
- `routes/` — Express route definitions
- `middleware/` — Auth, validation, error handling

## Features

- 🔐 **JWT Authentication** — Organizer signup/login with route protection
- 📅 **Event Management** — Create, edit, publish, cancel events
- 🎨 **Event Templates** — Tech Meetup, Webinar, Workshop presets
- 🔗 **Public Event Pages** — Shareable URLs with live status
- 🎟️ **RSVP System** — Open (instant) or Shortlisted (approval-based)
- 👥 **Attendee Management** — Approve, reject, revoke with capacity tracking
- 📧 **Email Notifications** — Registration, approval, rejection, cancellation
- 🔍 **Search & Filter** — Find events and attendees quickly

## Prerequisites

- **Node.js** 18+
- **MongoDB** running locally or a connection URI
- (Optional) SMTP credentials for email delivery

## Quick Start

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env
npm install

# Frontend
cd ../frontend
cp .env.example .env.local
npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/event-platform
JWT_SECRET=your-secret-key

# Optional — leave blank to log emails to console
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser.

## API Endpoints

### Auth
| Method | Endpoint         | Auth | Description        |
|--------|------------------|------|--------------------|
| POST   | `/api/auth/signup` | ✕  | Register organizer |
| POST   | `/api/auth/login`  | ✕  | Login → JWT        |
| GET    | `/api/auth/me`     | ✓  | Get current user   |

### Events
| Method | Endpoint                  | Auth | Description          |
|--------|---------------------------|------|----------------------|
| POST   | `/api/events`             | ✓    | Create event         |
| GET    | `/api/events`             | ✓    | List my events       |
| GET    | `/api/events/:id`         | ✓    | Get event            |
| PUT    | `/api/events/:id`         | ✓    | Update event         |
| PATCH  | `/api/events/:id/status`  | ✓    | Publish/cancel       |
| GET    | `/api/events/public/:slug`| ✕    | Public event page    |

### RSVPs
| Method | Endpoint                    | Auth | Description          |
|--------|-----------------------------|------|----------------------|
| POST   | `/api/rsvps/register/:slug` | ✕    | Register for event   |
| GET    | `/api/rsvps/event/:eventId` | ✓    | List attendees       |
| PATCH  | `/api/rsvps/:rsvpId/status` | ✓    | Approve/reject/revoke|

## User Flows

### Organizer Flow
1. Sign up → Log in
2. Create event (from template or scratch)
3. Publish event to make it public
4. Share public URL with attendees
5. Manage RSVPs (approve/reject in shortlisted mode)

### Attendee Flow
1. Visit public event page
2. Fill in name & email → Register
3. Receive confirmation email
4. (Shortlisted mode) Wait for organizer approval

## Tech Stack

| Layer     | Technology        |
|-----------|-------------------|
| Frontend  | Next.js 15 + React + TypeScript |
| Backend   | Node.js + Express |
| Database  | MongoDB + Mongoose |
| Auth      | JWT (jsonwebtoken + bcryptjs) |
| Email     | Nodemailer (SMTP) |
| Styling   | CSS Modules + Custom Design System |

## AI Assistant Integration

EventFlow includes a custom AI integration for Claude Desktop, letting you manage events and attendees using plain English.

### Connect Claude Desktop

1. Download and install Claude Desktop from https://claude.ai/download.
2. Open your Claude Desktop config file:
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
3. Add the following configuration:

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

### What you can ask Claude

- "List all my events."
- "Show me the details for event X."
- "How many people are registered for my upcoming event?"
- "Give me a summary of all pending registrations."
- "Update John Doe's registration status to approved."
- "Create an event with title, date-time, and venue; keep the rest as TBD."

### Notes

- Use `get_event_summary` for exact event totals and status breakdown.
- Use `get_live_event_details` to fetch the latest data from MongoDB.
- If your database has multiple organizers, pass `organizer_email` to the tools.

## License

MIT
