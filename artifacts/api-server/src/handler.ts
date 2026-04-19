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
 *
 * IMPORTANT: EdgeOne's event format differs from AWS Lambda. The normalizeEvent
 * function handles all known EdgeOne event shapes before serverless-http sees them.
 */
import serverless from "serverless-http";
import app from "./app.js";

const serverlessHandler = serverless(app);

/**
 * Normalize any EdgeOne event format to the AWS Lambda v1 format that
 * serverless-http's AWS provider expects:
 *   { httpMethod, path, headers, body, isBase64Encoded, queryStringParameters }
 *
 * EdgeOne formats seen in the wild:
 *
 *  A) Nested:  { version, request: { method, uri, headers, body, isBase64Encoded } }
 *  B) Flat:    { version, method, uri, headers, body, isBase64Encoded }
 *  C) AWS-compat: { httpMethod, path, headers, body, isBase64Encoded }   ← already fine
 */
function normalizeEvent(event: unknown): unknown {
  if (!event || typeof event !== "object") return event;
  const ev = event as Record<string, unknown>;

  // Always log event keys (not values) — shows in EdgeOne function logs.
  // This tells us exactly which format EdgeOne is using.
  console.log("[handler] event top-level keys:", Object.keys(ev).join(", "));
  if (ev.request && typeof ev.request === "object") {
    console.log("[handler] event.request keys:", Object.keys(ev.request as object).join(", "));
  }

  // ── Format A: nested { request: { method, uri, headers, body } } ─────────
  if (ev.request && typeof ev.request === "object") {
    const r = ev.request as Record<string, unknown>;
    const normalized = {
      ...ev,
      httpMethod: (r.method as string) || "GET",
      path: (r.uri as string) || (r.path as string) || "/",
      headers: lowerCaseHeaders((r.headers ?? ev.headers ?? {}) as Record<string, string>),
      body: (r.body as string) ?? (ev.body as string) ?? "",
      isBase64Encoded: (r.isBase64Encoded as boolean) ?? (ev.isBase64Encoded as boolean) ?? false,
      queryStringParameters: (r.queryStringParameters ?? ev.queryStringParameters ?? {}) as Record<string, string>,
      // serverless-http requires this even if empty
      requestContext: (ev.requestContext as Record<string, unknown>) ?? {},
    };
    console.log("[handler] normalized (format A) method:", normalized.httpMethod, "path:", normalized.path);
    return normalized;
  }

  // ── Format B: flat { method, uri, ... } (no httpMethod/path) ────────────
  if (!ev.httpMethod && (ev.method || ev.uri)) {
    const normalized = {
      ...ev,
      httpMethod: (ev.method as string) || "GET",
      path: (ev.uri as string) || (ev.path as string) || "/",
      headers: lowerCaseHeaders((ev.headers ?? {}) as Record<string, string>),
      body: (ev.body as string) ?? "",
      isBase64Encoded: (ev.isBase64Encoded as boolean) ?? false,
      queryStringParameters: (ev.queryStringParameters ?? ev.queryString ?? {}) as Record<string, string>,
      requestContext: (ev.requestContext as Record<string, unknown>) ?? {},
    };
    console.log("[handler] normalized (format B) method:", normalized.httpMethod, "path:", normalized.path);
    return normalized;
  }

  // ── Format C: already AWS-compatible ────────────────────────────────────
  console.log("[handler] using event as-is (format C), httpMethod:", ev.httpMethod ?? "(undefined)");
  // Ensure requestContext exists (serverless-http requires it)
  if (!ev.requestContext) {
    (ev as Record<string, unknown>).requestContext = {};
  }
  return ev;
}

/** Ensure all header names are lowercase — serverless-http / Express expect that. */
function lowerCaseHeaders(headers: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    result[k.toLowerCase()] = v;
  }
  return result;
}

export async function main(event: unknown, context: unknown) {
  const normalizedEvent = normalizeEvent(event);
  return serverlessHandler(normalizedEvent, context);
}

export default main;
