import { Router, type IRouter } from "express";
import { db, applicationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const OPERATOR_EMAIL = process.env.OPERATOR_EMAIL ?? "admin@rsrpresscorps.com";
const OPERATOR_PASSWORD = process.env.OPERATOR_PASSWORD ?? "rsr-command-2024";
const BOOTSTRAP_EMAIL = process.env.BOOTSTRAP_OPERATOR_EMAIL ?? "";
const BOOTSTRAP_PASSWORD = process.env.BOOTSTRAP_OPERATOR_PASSWORD ?? "";

function isOperator(email: string, password: string): boolean {
  const normalizedEmail = email.toLowerCase();
  if (normalizedEmail === OPERATOR_EMAIL.toLowerCase() && password === OPERATOR_PASSWORD) return true;
  if (BOOTSTRAP_EMAIL && normalizedEmail === BOOTSTRAP_EMAIL.toLowerCase() && password === BOOTSTRAP_PASSWORD) return true;
  return false;
}

router.post("/auth/login", async (req, res): Promise<void> => {
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

  const [application] = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.email, email.toLowerCase()));

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
