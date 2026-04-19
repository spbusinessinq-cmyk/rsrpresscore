/**
 * RSR Press Corps — EdgeOne Pages / Tencent SCF Cloud Function
 *
 * handler.mjs is built by: pnpm --filter @workspace/api-server run build
 * That script also copies the output here automatically.
 *
 * REQUIRED ENV VARS (set in EdgeOne project settings):
 *   DATABASE_URL         PostgreSQL connection string
 *   SESSION_SECRET       64-char random hex  (openssl rand -hex 64)
 *   OPERATOR_EMAIL       Command dashboard login email
 *   OPERATOR_PASSWORD    Command dashboard login password
 *   COOKIE_SAME_SITE     Set to "none" for cross-origin cookie support
 *   NODE_ENV             production
 *
 * ROUTE COVERAGE (all proxied through this single handler):
 *   /api/health
 *   /api/auth/*        login, logout, /me
 *   /api/applications
 *   /api/bulletins
 *   /api/assignments
 *   /api/schedule
 *   /api/messages
 *   /api/reports
 */

export { main } from "./handler.mjs";
