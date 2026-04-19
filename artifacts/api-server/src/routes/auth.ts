import { Router, type IRouter } from "express";
import { db, applicationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// All env vars read at request time — never captured at module load.
// EdgeOne Pages injects process.env after module evaluation.

function getAdminCreds() {
  return {
    username: (process.env.ADMIN_USERNAME ?? "").trim(),
    password: process.env.ADMIN_PASSWORD ?? "",
  };
}

function isAdmin(username: string, password: string): boolean {
  const admin = getAdminCreds();
  if (!admin.username || !admin.password) return false;
  const usernameMatch = username.trim().toLowerCase() === admin.username.toLowerCase();
  const passMatch = password === admin.password;
  console.log("[auth/isAdmin]", {
    username_match: usernameMatch,
    pass_match: passMatch,
    input_len: username.trim().length,
    stored_len: admin.username.length,
  });
  return usernameMatch && passMatch;
}

// ── Method/routing diagnostic ──────────────────────────────────────────────
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
// Safe: returns only booleans/lengths — never actual credential values.
// Remove once login is confirmed working in production.
router.get("/auth/debug-env", (_req, res): void => {
  const admin = getAdminCreds();
  res.json({
    admin_username_set: !!admin.username,
    admin_username_length: admin.username.length,
    admin_password_set: !!admin.password,
    admin_password_length: admin.password.length,
    session_secret_set: !!(process.env.SESSION_SECRET ?? ""),
    database_url_set: !!(process.env.DATABASE_URL ?? ""),
    node_env: process.env.NODE_ENV ?? "(not set)",
    runtime: "edgeone-cloud-function",
  });
});

// ── Login ──────────────────────────────────────────────────────────────────
router.post("/auth/login", async (req, res): Promise<void> => {
  const body = req.body ?? {};
  const { username, email, password } = body;

  console.log("[auth/login] received", {
    has_username: !!username,
    has_email: !!email,
    has_password: !!password,
    body_keys: Object.keys(body),
    content_type: req.headers["content-type"] ?? "(none)",
  });

  // ── Admin / Command path (username) ──
  if (username !== undefined) {
    if (!username || !password) {
      res.status(400).json({ error: "Missing username or password." });
      return;
    }

    const admin = getAdminCreds();
    if (!admin.username || !admin.password) {
      res.status(503).json({ error: "Server not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD." });
      return;
    }

    if (!isAdmin(String(username), String(password))) {
      res.status(401).json({ error: "Invalid credentials. Access denied." });
      return;
    }

    req.session.user = {
      id: 0,
      email: "command@rsrpresscorps.internal",
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

  // ── Member path (email) ──
  if (!email || !password) {
    res.status(400).json({ error: `Missing fields. Received: ${JSON.stringify({ email: !!email, password: !!password })}` });
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
