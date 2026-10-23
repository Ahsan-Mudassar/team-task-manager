# TaskFlow: Team Task Manager

A full-stack web app where teams can organise work: register and log in securely, create teams, add members, then create, assign and track tasks with search and filters.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)

**Live demo:** <https://team-task-manager-xi-pink.vercel.app> &nbsp;|&nbsp; **API:** <https://team-task-manager-oxqv.onrender.com/api/health>

> Demo account (optional): `demo@example.com` / `Demo1234`

## Features

- **Secure auth:** register, login, logout with Passport (local strategy) and HTTP-only session cookies. Passwords are hashed with bcrypt.
- **Teams:** create, edit and delete teams, add or remove members, leave a team.
- **Role-based access:** only a team *owner* can edit or delete the team and manage members. Members can work with tasks.
- **Tasks:** create, assign, update status and priority, set due dates, delete (owner or task creator only).
- **Search and filters:** by team, assignee ("Assigned to me"), status, priority and free-text search. Filters live in the URL, so views can be shared and survive a refresh.
- **Due-date reminders:** after login, a banner lists your overdue and soon-due tasks.
- **Responsive UI:** sidebar layout on desktop, drawer on mobile, skeleton loaders, empty and error states.
- **Page titles and a 404 page** for a polished navigation experience.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, react-hot-toast, lucide-react |
| Backend | Node.js, Express (ES modules), Passport, express-session, Joi |
| Database | PostgreSQL (Neon) via Sequelize; sessions stored in Postgres (`connect-pg-simple`) |
| Security | bcrypt, Helmet, CORS allowlist, rate limiting, input validation |
| Tooling | Docker, Docker Compose, GitHub Actions |

## Architecture

```
Browser ── React SPA (Vite) ──/api──> Express ──> Sequelize ──> PostgreSQL
                                        │
                                        └── sessions (connect-pg-simple) ──> PostgreSQL
```

```
.
├── backend/
│   └── src/
│       ├── config/        db, session, passport
│       ├── models/        User, Team, TeamMember, Task (+ relations)
│       ├── routes/        thin route definitions
│       ├── controllers/   request handling and business rules
│       ├── middleware/    auth, validation, team role checks, error handler
│       ├── validators/    Joi schemas
│       └── utils/         ApiError, asyncHandler
├── frontend/
│   └── src/
│       ├── api/           axios instance and API modules
│       ├── context/       Auth and Teams providers
│       ├── components/    ui, layout, teams, tasks
│       ├── hooks/         useFetch, useDebounce, useTaskFilters, usePageTitle
│       ├── pages/         Login, Register, Dashboard, Teams, TeamDetails, NotFound
│       └── utils/         validators, formatters, error helpers
├── Dockerfile
├── docker-compose.yml
└── .github/               CI workflow and PR template
```

Design rule: **routes** define URLs, **controllers** do the work, **models** talk to the database, and **middleware** handles cross-cutting concerns (auth, validation, roles).

## Database schema

```mermaid
erDiagram
  USERS ||--o{ TEAMS : creates
  USERS ||--o{ TEAM_MEMBERS : "joins as"
  TEAMS ||--o{ TEAM_MEMBERS : has
  TEAMS ||--o{ TASKS : contains
  USERS ||--o{ TASKS : "assigned to"

  USERS { uuid id PK; string name; string email UK; string password }
  TEAMS { uuid id PK; string name; text description; uuid creatorId FK }
  TEAM_MEMBERS { uuid userId PK; uuid teamId PK; enum role }
  TASKS { uuid id PK; string title; text description; enum status; enum priority; date dueDate; uuid teamId FK; uuid assigneeId FK; uuid createdById FK }
```

## API overview

All routes except `/api/auth/*` and `/api/health` require an authenticated session.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Create account and log in | Public |
| POST | `/api/auth/login` | Log in | Public |
| POST | `/api/auth/logout` | Log out | Authenticated |
| GET | `/api/auth/me` | Current user | Authenticated |
| GET / POST | `/api/teams` | List my teams / create a team | Authenticated |
| GET | `/api/teams/:teamId` | Team with members | Member |
| PATCH / DELETE | `/api/teams/:teamId` | Update / delete team | Owner |
| POST | `/api/teams/:teamId/members` | Add member by email | Owner |
| DELETE | `/api/teams/:teamId/members/:userId` | Remove member (or leave) | Owner / self |
| GET | `/api/tasks` | List tasks: `teamId`, `assigneeId` (`me`), `status`, `priority`, `search`, `page`, `limit` | Member |
| POST | `/api/tasks` | Create task | Member |
| GET / PATCH | `/api/tasks/:taskId` | Read / update task | Member |
| DELETE | `/api/tasks/:taskId` | Delete task | Owner or creator |
| GET | `/api/tasks/reminders` | My overdue and due-soon tasks | Authenticated |
| GET | `/api/health` | Health check | Public |

Errors share one shape: `{ "message": "...", "details": [{ "field": "...", "message": "..." }] }`.

## Security practices

- Passwords hashed with **bcrypt** (cost 12) and never returned in responses.
- **HTTP-only**, `SameSite` session cookies, `Secure` in production; sessions stored server-side in PostgreSQL.
- **Auth middleware** is mounted once on `/api/teams` and `/api/tasks`, so no route is protected by accident-of-omission.
- **Authorization:** team membership and role checked on every team and task operation. Non-members receive `404`, not `403`, so team existence is not leaked.
- **Joi validation** with `stripUnknown`, rejection of `<` and `>` in text fields, UUID checks on route params.
- **Helmet**, **CORS allowlist** with credentials, **rate limiting** on auth routes, request body size limit.
- Sequelize parameterised queries protect against SQL injection.

## Requirements checklist

| Requirement | Status |
|---|---|
| Register / login securely | Done |
| Create and manage teams, add members | Done |
| Create, assign and manage tasks in teams | Done |
| View tasks filtered by team or assignee | Done |
| React + Tailwind + Vite, dashboard, task modal, search and filter | Done |
| Node + Express REST API (`/auth`, `/teams`, `/tasks`) with validation | Done |
| Passport + express-session, sessions in PostgreSQL, HTTP-only cookies | Done |
| Protect all non-auth routes, bcrypt, input validation | Done |
| Bonus: role-based access | Done |
| Bonus: due-date reminders (shown after login) | Done |
| Bonus: invite by email (stub) | Not implemented, see roadmap |

## Getting started

**Prerequisites:** Node.js 20+, PostgreSQL 14+ (or Docker).

```bash
git clone https://github.com/Ahsan-Mudassar/team-task-manager.git
cd team-task-manager
```

### 1. Backend

```bash
cd backend
cp .env.sample .env      # then edit the values
npm install
npm run dev              # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

The Vite dev server proxies `/api` to the backend, so no CORS setup is needed locally.

### Or run everything with Docker

```bash
docker compose up --build   # http://localhost:8080
```

### Environment variables (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | API port | `5000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@localhost:5432/taskmanager` |
| `SESSION_SECRET` | Long random string for signing cookies | `change-me` |
| `SESSION_STORE` | `postgres` (default) or `memory` for quick local dev | `postgres` |
| `CLIENT_URL` | Comma-separated allowed origins for CORS | `http://localhost:5173` |

Tables are created automatically on first start (`sequelize.sync()`).

## Deployment

| Part | Platform |
|---|---|
| Frontend | Vercel |
| Backend API | Render |
| Database | Neon (serverless PostgreSQL) |

Set the same environment variables on Render. For Vercel, point `/api` to the Render service (rewrite) so the browser sees a single origin and session cookies work without cross-site settings.

A multi-stage `Dockerfile` (builds the React app and serves it from Express) is included, so the app is portable to any container platform.

## Git workflow

Work is done on short-lived branches and merged through pull requests:
`feature/auth`, `feature/teams`, `feature/tasks`, `feature/frontend-auth`, `feature/teams-ui`, `feature/tasks-ui`, and so on. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`).

## Roadmap

- Invite members by email (stubbed, then real SMTP)
- Database migrations instead of `sequelize.sync()`
- Automated tests (API integration tests, component tests)
- Quick status change on task cards with optimistic updates
- Configurable reminder window (`?days=`) and email reminders
- Migrate to TypeScript

## Author

**Ahsan Mudassar**, full-stack developer.
[GitHub](https://github.com/Ahsan-Mudassar) · [LinkedIn](https://linkedin.com/in/ahsan-mudassar)

## License

MIT