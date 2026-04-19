/**
 * RSR Press Corps — EdgeOne Pages catch-all Node Function for /api/*
 *
 * EdgeOne requires the entry file to be [[default]].js (not .mjs).
 * The parent cloud-functions/package.json has "type": "module" so this
 * .js file is treated as ESM — export syntax works fine.
 *
 * app.mjs is built from src/app.ts and copied here by:
 *   pnpm --filter @workspace/api-server run build
 *
 * EdgeOne's native Node Functions runtime passes real Node.js HTTP
 * req/res to the Express app. No serverless-http, no Lambda events,
 * no normalizeEvent, no method translation.
 *
 * Required ENV VARS (set in EdgeOne project → Environment Variables):
 *   DATABASE_URL       PostgreSQL connection string
 *   SESSION_SECRET     64-char hex  (openssl rand -hex 64)
 *   OPERATOR_EMAIL     Command dashboard login email
 *   OPERATOR_PASSWORD  Command dashboard login password
 *   COOKIE_SAME_SITE   none  (cross-origin cookie support)
 *   NODE_ENV           production
 */
export { default } from "./app.mjs";
