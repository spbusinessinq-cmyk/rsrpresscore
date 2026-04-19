/**
 * RSR Press Corps — EdgeOne Pages / Tencent SCF Cloud Function
 *
 * This file re-exports the pre-built serverless handler from the API server.
 *
 * PREREQUISITES (must run before deploying this function):
 *   pnpm --filter @workspace/api-server run build
 *   → produces: artifacts/api-server/dist/handler.mjs
 *
 * HANDLER FORMAT (Tencent SCF / EdgeOne Cloud Functions):
 *   module.exports.main = serverless(expressApp)
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

// The API server build bundles the entire Express app + all workspace packages
// into a single self-contained handler. Build first, then deploy.
export { main } from "../../artifacts/api-server/dist/handler.mjs";
