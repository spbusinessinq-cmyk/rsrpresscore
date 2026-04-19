# RSR Press Corps Platform

## Overview

A full two-sided operational platform for RSR Press Corps — the public-facing field reporting and media arm of Red State Rhetoric.

### Architecture: 3 Layers

**Layer 1 — Public Site** (`/`)
- Landing page with hardened dark tactical aesthetic
- Application intake with full form (POST /api/apply)
- Active Operations preview board
- Access tier structure display

**Layer 2 — Command Dashboard** (`/command`)
- Operator-only. Login via `OPERATOR_EMAIL` / `OPERATOR_PASSWORD` env vars.
- Review and manage incoming applications (accept/reject/hold/review)
- Create and manage bulletins, assignments, schedule items
- View submitted field reports

**Layer 3 — Member Portal** (`/portal`)
- Accepted members only. Login with email + access code (generated on acceptance)
- Bulletin board, active assignments, schedule
- Field report submission
- Internal communications board (polls every 10s)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/rsr-press-corps), Tailwind CSS, Framer Motion, Wouter routing
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Session-based (express-session + connect-pg-simple) with two roles: operator, member
- **Validation**: Zod (zod/v4), drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Auth Logic

- **Operator login**: `OPERATOR_EMAIL` and `OPERATOR_PASSWORD` env vars (required — no defaults)
- **Member login**: email (from accepted application) + access code (auto-generated 8-char hex code on acceptance)
- **Session**: stored in PostgreSQL `session` table via connect-pg-simple
- **Session secret**: `SESSION_SECRET` env var (already configured)

## Notifications

- Discord webhook notifications for new applications and field reports
- Set `DISCORD_WEBHOOK_URL` env var to enable (optional, falls back to log-only)

## Database Tables

- `applications` — press corps applications with status tracking
- `bulletins` — internal bulletin board (priority: standard/important/urgent)
- `assignments` — field assignments/taskings (visibility: public_preview/members_only)
- `schedule_items` — scheduled events and coverage windows
- `messages` — internal comms messages
- `reports` — submitted field reports
- `session` — express session storage

## API Routes

All routes under `/api`:
- `POST /apply` — submit application
- `GET/PATCH /applications` — list and manage applications (operator)
- `GET/POST/PUT/DELETE /bulletins` — bulletin CRUD
- `GET/POST/PATCH/DELETE /assignments` — assignment CRUD
- `GET/POST/DELETE /schedule` — schedule CRUD
- `GET/POST /messages` — internal comms
- `GET/POST /reports` — field reports
- `POST /auth/login` — authenticate
- `POST /auth/logout` — end session
- `GET /auth/me` — get current session user
