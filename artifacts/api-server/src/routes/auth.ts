import { Router, type IRouter } from "express";
import { db, applicationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const OPERATOR_EMAIL = process.env.OPERATOR_EMAIL;
const OPERATOR_PASSWORD = process.env.OPERATOR_PASSWORD;

if (!OPERATOR_EMAIL || !OPERATOR_PASSWORD) {
  console.warn(
    "[auth] WARNING: OPERATOR_EMAIL and OPERATOR_PASSWORD are not set. " +
    "Operator login will return 503 until these are configured."
  );
}

const BOOTSTRAP_EMAIL = process.env.BOOTSTRAP_OPERATOR_EMAIL ?? "";
const BOOTSTRAP_PASSWORD = process.env.BOOTSTRAP_OPERATOR_PASSWORD ?? "";

function isOperator(email: string, password: string): boolean {
  if (!OPERATOR_EMAIL || !OPERATOR_PASSWORD) return false;
  const normalizedEmail = email.toLowerCase();
  if (normalizedEmail === OPERATOR_EMAIL.toLowerCase() && password === OPERATOR_PASSWORD) return true;
  if (BOOTSTRAP_EMAIL && normalizedEmail === BOOTSTRAP_EMAIL.toLowerCase() && password === BOOTSTRAP_PASSWORD) return true;
  return false;
}

router.post("/auth/login", async (req, res): Promise<void> => {
  if (!OPERATOR_EMAIL || !OPERATOR_PASSWORD) {
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
      email: email.toLowerCase(),
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
      .where(eq(applicationsTable.email, email.toLowerCase()));
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
