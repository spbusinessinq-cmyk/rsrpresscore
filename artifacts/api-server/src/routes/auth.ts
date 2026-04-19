import { Router, type IRouter } from "express";
import { db, applicationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// Read env vars at request time (not module load time).
// Some edge runtimes (including Tencent SCF / EdgeOne Pages) inject env vars
// into process.env lazily — after the module has been evaluated. Capturing them
// in module-level constants means they're always undefined in those environments.
function getOperatorCreds() {
  return {
    email: process.env.OPERATOR_EMAIL ?? "",
    password: process.env.OPERATOR_PASSWORD ?? "",
  };
}

function getBootstrapCreds() {
  return {
    email: process.env.BOOTSTRAP_OPERATOR_EMAIL ?? "",
    password: process.env.BOOTSTRAP_OPERATOR_PASSWORD ?? "",
  };
}

function isOperator(email: string, password: string): boolean {
  const op = getOperatorCreds();
  if (!op.email || !op.password) return false;
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail === op.email.trim().toLowerCase() && password === op.password) return true;
  const boot = getBootstrapCreds();
  if (boot.email && normalizedEmail === boot.email.trim().toLowerCase() && password === boot.password) return true;
  return false;
}

router.post("/auth/login", async (req, res): Promise<void> => {
  const op = getOperatorCreds();

  // Safe debug log — shows in EdgeOne function logs, never exposes secrets
  console.log("[auth/login]", {
    operator_email_set: !!op.email,
    operator_password_set: !!op.password,
    bootstrap_email_set: !!process.env.BOOTSTRAP_OPERATOR_EMAIL,
    received_email: req.body?.email ?? "(none)",
  });

  if (!op.email || !op.password) {
    res.status(503).json({ error: "Server not configured. Set OPERATOR_EMAIL and OPERATOR_PASSWORD." });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  if (isOperator(email, password)) {
    req.session.user = {
      id: 0,
      email: email.trim().toLowerCase(),
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
      .where(eq(applicationsTable.email, email.trim().toLowerCase()));
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

  if (!application.accessCode || application.accessCode !== password) {
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

router.post("/auth/logout", (req, res): void => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/auth/me", (req, res): void => {
  if (!req.session.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(req.session.user);
});

export default router;
