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

## Architecture Notes

- **nginx** serves the React SPA and reverse-proxies `/api/*` to the Express API container
- **Session cookies** are `httpOnly`, `secure` (in production), `sameSite: strict`
- **CORS** is configured to allow credentials — the SPA and API share the same origin via nginx
- **Discord notifications** are optional — the server starts and operates normally without a webhook URL
- **Operator login** uses credential-based auth (no external identity provider)
- **Member login** uses the access code issued when an application is accepted
