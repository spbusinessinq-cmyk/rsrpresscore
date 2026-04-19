# RSR Press Corps

Operational platform for the Red State Rhetoric independent media network. A credentialed press operations system with three access layers.

---

## Layers

| Layer | Path | Access |
|---|---|---|
| **Public Site** | `/` | Open — landing, about, operations, intake |
| **Member Portal** | `/portal` | Accepted correspondents |
| **Command Dashboard** | `/command` | Network operator only |

---

## Stack

| Component | Technology |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS v4, Wouter, TanStack Query |
| Backend | Node.js, Express 5, pino logging |
| Database | PostgreSQL + Drizzle ORM |
| Session | express-session + connect-pg-simple |
| Build | pnpm monorepo, esbuild (API), Vite (frontend) |
| Container | Docker multi-stage, nginx |

---

## Environment Variables

All required before first run. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | 64-char random secret for session signing |
| `OPERATOR_EMAIL` | Yes | Login email for Command dashboard |
| `OPERATOR_PASSWORD` | Yes | Login password for Command dashboard |
| `DB_PASSWORD` | Yes (compose) | PostgreSQL password for the `db` service |
| `COOKIE_SAME_SITE` | No | `none` (cross-origin / EdgeOne), `strict` (nginx same-origin), `lax` (dev) |
| `VITE_API_BASE_URL` | No | External API base URL (EdgeOne only — e.g. `https://api.rsrpresscorps.com`) |
| `BOOTSTRAP_OPERATOR_EMAIL` | No | Secondary operator login email |
| `BOOTSTRAP_OPERATOR_PASSWORD` | No | Secondary operator login password |
| `DISCORD_WEBHOOK_URL` | No | Discord webhook for application notifications |
| `WEB_PORT` | No | Host port for nginx (default: 80) |

Generate `SESSION_SECRET`:

```bash
openssl rand -hex 64
```

---

## Database Schema

The schema is managed via Drizzle ORM (schema-push, no migration files):

```bash
# After first deploy, push schema to your database:
pnpm --filter @workspace/db run push
```

The session table must also exist. Create it manually once:

```sql
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
```

---

## Local Development (Replit)

The project is configured to run in Replit. Workflows are pre-configured. Ensure the following secrets are set in the Replit Secrets panel:

- `SESSION_SECRET`
- `DATABASE_URL` (auto-provisioned by Replit)
- `OPERATOR_EMAIL`
- `OPERATOR_PASSWORD`

---

## Docker Build

```bash
# Build all services
docker compose build

# Start stack (requires .env file)
docker compose up -d

# View logs
docker compose logs -f

# Stop stack
docker compose down
```

---

## Portainer Deployment

1. Push repository to GitHub
2. In Portainer, create a new **Stack**
3. Select **Repository** and enter your GitHub repo URL
4. Set the following **Environment Variables** in the Portainer UI (do not put secrets in the compose file):

```
DATABASE_URL=postgresql://rsr:YOURPASSWORD@db:5432/rsr_press_corps
DB_PASSWORD=YOURPASSWORD
SESSION_SECRET=<64 char hex>
OPERATOR_EMAIL=admin@yourdomain.com
OPERATOR_PASSWORD=<strong password>
```

5. Deploy the stack
6. After first deploy, run the schema push (once):

```bash
# From within the api container:
docker exec -it <api-container-name> sh
# Then inside the container — or run from host with DATABASE_URL set:
pnpm --filter @workspace/db run push
```

7. Create the session table (once — see Database Schema section above)
8. The site is available on port 80 (or `WEB_PORT` if overridden)

---

## GitHub Push

```bash
git remote add origin https://github.com/YOUR_ORG/rsr-press-corps.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

Verify no secrets are committed before pushing:

```bash
git diff HEAD --name-only
# .env should NOT appear — it is in .gitignore
```

---

## EdgeOne Pages Deployment

The frontend is a static React SPA. The backend is an Express.js + PostgreSQL server.
EdgeOne Pages hosts the **static frontend** and routes `/api/*` through **EdgeOne Cloud Functions** backed by the pre-built Express handler.

### Architecture

```
EdgeOne Pages CDN → static frontend (artifacts/rsr-press-corps/dist/public)
EdgeOne Cloud Functions → /api/* → cloud-functions/api/index.js → Express handler
```

### Step 1 — GitHub Push

```bash
git remote add origin https://github.com/YOUR_ORG/rsr-press-corps.git
git add .
git commit -m "Ready for EdgeOne Pages deployment"
git push -u origin main
```

### Step 2 — EdgeOne Project Setup

1. Log into EdgeOne Pages → **Create project** → **Import from GitHub**
2. Select the repository

### Step 3 — Build Settings (enter in EdgeOne dashboard)

| Setting | Value |
|---|---|
| **Build command** | `pnpm install && pnpm --filter @workspace/api-server run build && BASE_PATH=/ PORT=3000 pnpm --filter @workspace/rsr-press-corps run build` |
| **Output directory** | `artifacts/rsr-press-corps/dist/public` |
| **Cloud functions directory** | `cloud-functions` |
| **Node version** | `22` |

### Step 4 — Environment Variables (set in EdgeOne project settings)

Set all of these in the **EdgeOne environment variables** panel — do NOT commit real values:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql://USER:PASSWORD@HOST:5432/DBNAME` |
| `SESSION_SECRET` | Output of `openssl rand -hex 64` |
| `OPERATOR_EMAIL` | Your command dashboard email |
| `OPERATOR_PASSWORD` | Your command dashboard password |
| `COOKIE_SAME_SITE` | `none` |
| `NODE_ENV` | `production` |
| `VITE_API_BASE_URL` | Leave blank — API is handled by cloud functions on the same domain |

> `VITE_API_BASE_URL` is only needed when the API runs on a **completely separate domain**
> (e.g., Railway/Render). When using EdgeOne Cloud Functions, the API is served from the
> same EdgeOne domain and the default relative `/api/*` routing works.

### Step 5 — Database Setup (run once after first deploy)

```bash
# Push schema to your PostgreSQL database (run with DATABASE_URL set):
pnpm --filter @workspace/db run push

# Create session table (run once in your PostgreSQL database):
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
```

### Cross-Origin API Deployment (alternative)

If you prefer to run the API server on a separate Node.js host (Railway, Render, Fly.io):

1. Deploy the API server to that host with all the same env vars above
2. In EdgeOne, set `VITE_API_BASE_URL=https://your-api-host.com` as a build-time env var
3. On the API host, set `COOKIE_SAME_SITE=none` and ensure HTTPS is enabled
4. The frontend will automatically call the external API URL

---

## Architecture Notes

- **nginx** (Docker path) serves the React SPA and reverse-proxies `/api/*` to the Express API container
- **EdgeOne** (EdgeOne path) serves the React SPA statically; cloud functions handle `/api/*`
- **Session cookies** are `httpOnly`, `secure` in production. `sameSite` is controlled by `COOKIE_SAME_SITE` env var (`none` for cross-origin, `strict` for same-origin nginx, `lax` in dev)
- **CORS** is configured to reflect the request origin with credentials — compatible with same-origin and cross-origin setups
- **Discord notifications** are optional — the server starts and operates normally without a webhook URL
- **Operator login** uses credential-based auth (no external identity provider)
- **Member login** uses the access code issued when an application is accepted
