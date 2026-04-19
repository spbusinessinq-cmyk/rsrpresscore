/**
 * RSR Press Corps — EdgeOne Pages entry point
 *
 * Delegates to [[default]].mjs which exports the Express app natively.
 * app.mjs is built + copied here by: pnpm --filter @workspace/api-server run build
 */
export { default } from "./app.mjs";
