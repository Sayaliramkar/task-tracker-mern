# TaskFlow — MERN Task Tracker

> Full-stack task management application built with MongoDB, Express.js, React, and Node.js.
> Submitted for COLL-EDGE CONNECT Full-Stack Assignment.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | `https://your-app.vercel.app` *(update after deploy)* |
| Backend API | `https://your-api.onrender.com` *(update after deploy)* |

---

## Features

### Core (Mandatory)
- **Full CRUD** — Create, view, update, and delete tasks
- **Form validation** — Client-side and server-side validation with error messages
- **REST API** — 7 endpoints with Express.js
- **MongoDB integration** — Mongoose ODM with indexing
- **Responsive UI** — Mobile-first design, works on all screen sizes
- **Dynamic updates** — No page refresh required for any operation

### Bonus
- **Filter by status and priority** — Click stat cards or use dropdowns
- **Search** — Full-text search across title, description, and tags
- **Sorting** — By date, title, priority, due date
- **Toast notifications** — Success/error/info feedback after every action
- **Due date tracking** — Overdue and "due today" visual indicators
- **Tags** — Comma-separated task tags with visual display
- **Priority color coding** — Left border color per priority
- **Quick status change** — Inline dropdown on each card
- **Batch delete** — Clear all completed tasks at once
- **Environment variables** — All config via `.env` files
- **Reusable components** — TaskCard, TaskModal, FilterBar, StatsBar, NotificationStack
- **Context + useReducer** — Global state management without Redux
- **Custom hooks** — `useTaskForm` for form logic
- **Keyboard accessible** — Full keyboard navigation, ARIA labels

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Context API, Axios, date-fns |
| Backend | Node.js, Express.js, express-validator |
| Database | MongoDB Atlas, Mongoose |
| Deploy (FE) | Vercel |
| Deploy (BE) | Render |

---

## Project Structure

```
task-tracker/
├── backend/
│   ├── models/
│   │   └── Task.js           # Mongoose schema
│   ├── routes/
│   │   └── tasks.js          # REST endpoints
│   ├── server.js             # Express app + MongoDB connect
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskCard.js       # Single task card
│   │   │   ├── TaskList.js       # Grid of cards + empty states
│   │   │   ├── TaskModal.js      # Create/Edit modal
│   │   │   ├── FilterBar.js      # Search, filter, sort controls
│   │   │   ├── StatsBar.js       # Summary stat cards
│   │   │   └── NotificationStack.js  # Toast notifications
│   │   ├── context/
│   │   │   └── TaskContext.js    # Global state + API calls
│   │   ├── hooks/
│   │   │   └── useTaskForm.js    # Form state + validation logic
│   │   ├── utils/
│   │   │   └── api.js            # Axios instance + taskAPI methods
│   │   ├── App.js
│   │   ├── App.css               # Full design system
│   │   └── index.js
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
│
├── render.yaml                   # Backend deploy config
├── package.json                  # Root scripts
└── README.md
```

---

## REST API Reference

Base URL: `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks (supports `?status=`, `?priority=`, `?sort=`, `?search=`) |
| GET | `/tasks/:id` | Get single task |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task |
| PATCH | `/tasks/:id/status` | Update status only |
| DELETE | `/tasks/:id` | Delete task |
| DELETE | `/tasks` | Delete all completed tasks |
| GET | `/health` | Server health check |

### Task Schema

```json
{
  "_id": "ObjectId",
  "title": "string (required, 3–100 chars)",
  "description": "string (optional, max 500 chars)",
  "status": "todo | in-progress | completed",
  "priority": "low | medium | high",
  "dueDate": "ISO date | null",
  "tags": ["string"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/task-tracker-mern.git
cd task-tracker-mern
npm run install:all
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/tasktracker
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Configure Frontend

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run

Open two terminals:

```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

Visit: http://localhost:3000

---

## Deployment

### Backend → Render

1. Push repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect repo, set root dir to `backend`
4. Add environment variables:
   - `MONGODB_URI` — your Atlas URI
   - `FRONTEND_URL` — your Vercel URL (after deploying frontend)
   - `NODE_ENV` — `production`
5. Deploy

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import repo, set root dir to `frontend`
3. Add environment variable:
   - `REACT_APP_API_URL` — your Render backend URL + `/api`
4. Deploy

---

## Design Decisions

- **Context + useReducer** over Redux — sufficient for this scale, no extra dependencies
- **Custom `useTaskForm` hook** — separates form logic from UI, reused for create and edit
- **Optimistic UI pattern** — dispatch local state updates then re-fetch for accuracy
- **Debounced search** — 350ms delay avoids excess API calls while typing
- **Double-confirm delete** — prevents accidental deletion without a modal
- **CSS custom properties** — entire design system in `:root`, easy to theme

---

*Built by [Your Name] · June 2026 · COLL-EDGE CONNECT Assignment*
