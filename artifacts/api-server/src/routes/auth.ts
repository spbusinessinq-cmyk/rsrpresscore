import { Router, type IRouter } from "express";
import { db, applicationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// All env vars are read at request time — never captured at module load.
// EdgeOne Pages (Tencent SCF) injects process.env after module evaluation.

function getOperatorCreds() {
  return {
    email: (process.env.OPERATOR_EMAIL ?? "").trim(),
    password: process.env.OPERATOR_PASSWORD ?? "",
  };
}

function getBootstrapCreds() {
  return {
    email: (process.env.BOOTSTRAP_OPERATOR_EMAIL ?? "").trim(),
    password: process.env.BOOTSTRAP_OPERATOR_PASSWORD ?? "",
  };
}

function isOperator(email: string, password: string): boolean {
  const op = getOperatorCreds();
  if (!op.email || !op.password) return false;
  const normalizedInput = email.trim().toLowerCase();
  const normalizedOp = op.email.toLowerCase();
  const emailMatch = normalizedInput === normalizedOp;
  const passMatch = password === op.password;
  console.log("[auth/isOperator]", {
    email_match: emailMatch,
    pass_match: passMatch,
    input_email_len: normalizedInput.length,
    stored_email_len: normalizedOp.length,
    input_pass_len: password.length,
    stored_pass_len: op.password.length,
  });
  if (emailMatch && passMatch) return true;
  const boot = getBootstrapCreds();
  if (boot.email && normalizedInput === boot.email.toLowerCase() && password === boot.password) return true;
  return false;
}

// ── Method/routing diagnostic ──────────────────────────────────────────────
// Accepts ALL methods — confirms POST can reach Express through EdgeOne's layer.
// Hit GET /api/auth/debug-request AND then POST /api/auth/debug-request to confirm.
router.all("/auth/debug-request", (req, res): void => {
  res.json({
    method_received: req.method,
    path_received: req.path,
    content_type: req.headers["content-type"] ?? "(none)",
    body_keys: Object.keys(req.body ?? {}),
    body_is_object: typeof req.body === "object" && req.body !== null,
    host: req.headers["host"] ?? "(none)",
  });
});

// ── Diagnostic endpoint ────────────────────────────────────────────────────
// Safe: returns only booleans and lengths — never actual credential values.
// Remove or gate behind NODE_ENV !== "production" once login is confirmed working.
router.get("/auth/debug-env", (_req, res): void => {
  const op = getOperatorCreds();
  const boot = getBootstrapCreds();
  res.json({
    operator_email_set: !!op.email,
    operator_email_length: op.email.length,
    operator_email_has_at: op.email.includes("@"),
    operator_email_has_space: op.email.includes(" "),
    operator_password_set: !!op.password,
    operator_password_length: op.password.length,
    bootstrap_email_set: !!boot.email,
    bootstrap_password_set: !!boot.password,
    session_secret_set: !!(process.env.SESSION_SECRET ?? ""),
    database_url_set: !!(process.env.DATABASE_URL ?? ""),
    node_env: process.env.NODE_ENV ?? "(not set)",
    runtime: "edgeone-cloud-function",
  });
});

// ── Login ──────────────────────────────────────────────────────────────────
router.post("/auth/login", async (req, res): Promise<void> => {
  const op = getOperatorCreds();

  console.log("[auth/login] env-check", {
    operator_email_set: !!op.email,
    operator_password_set: !!op.password,
    bootstrap_email_set: !!process.env.BOOTSTRAP_OPERATOR_EMAIL,
    received_email: req.body?.email ?? "(none)",
    body_keys: Object.keys(req.body ?? {}),
    content_type: req.headers["content-type"] ?? "(none)",
  });

  if (!op.email || !op.password) {
    res.status(503).json({ error: "Server not configured. Set OPERATOR_EMAIL and OPERATOR_PASSWORD." });
    return;
  }

  const { email, password } = req.body ?? {};

  if (!email || !password) {
    res.status(400).json({ error: `Missing fields. Received: ${JSON.stringify({ email: !!email, password: !!password })}` });
    return;
  }

  if (isOperator(String(email), String(password))) {
    req.session.user = {
      id: 0,
      email: String(email).trim().toLowerCase(),
      name: "Command",
      role: "operator",
      tier: "command",
    };
    await new Promise<void>((resolve, reject) =>
      req.session.save((err) => (err ? reject(err) : resolve()))
    );
    res.json(req.session.user);
    return;
  }

  let application;
  try {
    const [row] = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.email, String(email).trim().toLowerCase()));
    application = row;
  } catch (err) {
    console.error("[auth] DB query failed during login:", err);
    res.status(503).json({ error: "Service temporarily unavailable. Try again." });
    return;
  }

  if (!application) {
    res.status(401).json({ error: "Invalid credentials. Access denied." });
    return;
  }

  if (application.status !== "accepted") {
    res.status(401).json({ error: "Application not yet accepted. Access denied." });
    return;
  }

  if (!application.accessCode || application.accessCode !== String(password)) {
    res.status(401).json({ error: "Invalid credentials. Access denied." });
    return;
  }

  req.session.user = {
    id: application.id,
    email: application.email,
    name: application.name,
    role: "member",
    tier: application.experienceLevel,
  };

  await new Promise<void>((resolve, reject) =>
    req.session.save((err) => (err ? reject(err) : resolve()))
  );

  res.json(req.session.user);
});

// ── Logout ─────────────────────────────────────────────────────────────────
router.post("/auth/logout", (req, res): void => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// ── Session check ──────────────────────────────────────────────────────────
router.get("/auth/me", (req, res): void => {
  if (!req.session.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(req.session.user);
});

export default router;
