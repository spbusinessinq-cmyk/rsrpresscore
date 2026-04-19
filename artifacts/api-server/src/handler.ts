/**
 * EdgeOne Pages / Tencent SCF serverless handler.
 *
 * This wraps the Express app with serverless-http so it can be invoked
 * as a cloud function instead of a long-running server.
 *
 * Build: pnpm --filter @workspace/api-server run build
 * Output: artifacts/api-server/dist/handler.mjs
 *
 * Handler format — Tencent SCF / EdgeOne Cloud Functions:
 *   exports.main = async (event, context) => { statusCode, headers, body }
 */
import serverless from "serverless-http";
import app from "./app.js";

export const main = serverless(app);
export default main;
