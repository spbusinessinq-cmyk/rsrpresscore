import { Router, type IRouter } from "express";
import { db, applicationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  SubmitApplicationBody,
  UpdateApplicationStatusBody,
  UpdateApplicationStatusParams,
  UpdateApplicationNotesBody,
  UpdateApplicationNotesParams,
  GetApplicationParams,
  ListApplicationsQueryParams,
} from "@workspace/api-zod";
import { notifyDiscord } from "../lib/notify";
import crypto from "crypto";

const router: IRouter = Router();

// ── Password utils (crypto.scrypt — built-in, no native deps) ──────────────

async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    if (!salt || !key) { resolve(false); return; }
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(key === derivedKey.toString("hex"));
    });
  });
}

// ── Signup — simple name/email/password account creation ──────────────────
router.post("/signup", async (req, res): Promise<void> => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required." });
    return;
  }

  if (typeof password !== "string" || password.length < 4) {
    res.status(400).json({ error: "Password must be at least 4 characters." });
    return;
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // Check for duplicate email
  try {
    const [existing] = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.email, normalizedEmail));
    if (existing) {
      res.status(409).json({ error: "An account with that email already exists." });
      return;
    }
  } catch (err) {
    console.error("[signup] DB lookup failed:", err);
    res.status(503).json({ error: "Service temporarily unavailable. Try again." });
    return;
  }

  const passwordHash = await hashPassword(String(password));

  try {
    const [user] = await db
      .insert(applicationsTable)
      .values({
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash,
        status: "pending",
      })
      .returning();

    console.log("[signup] new account created:", { id: user.id, email: user.email });

    await notifyDiscord(
      `**NEW SIGNUP**\nName: ${user.name}\nEmail: ${user.email}\nStatus: pending`
    ).catch(() => {}); // Non-fatal

    res.status(201).json({ id: user.id, email: user.email, name: user.name, status: user.status });
  } catch (err) {
    console.error("[signup] DB insert failed:", err);
    res.status(503).json({ error: "Service temporarily unavailable. Try again." });
  }
});

// ── Full application submit (existing flow) ────────────────────────────────
router.post("/apply", async (req, res): Promise<void> => {
  const parsed = SubmitApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const [application] = await db
    .insert(applicationsTable)
    .values({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone ?? null,
      city: data.city,
      state: data.state,
      areasOfOperation: data.areasOfOperation,
      experienceLevel: data.experienceLevel,
      workTypes: data.workTypes,
      intent: data.intent,
      links: data.links ?? null,
      status: "pending",
    })
    .returning();

  await notifyDiscord(
    `**NEW APPLICATION RECEIVED**\nName: ${application.name}\nEmail: ${application.email}\nLocation: ${application.city}, ${application.state}\nExperience: ${application.experienceLevel}\nWork Types: ${application.workTypes.join(", ")}`
  );

  res.status(201).json(application);
});

router.get("/applications", async (req, res): Promise<void> => {
  const params = ListApplicationsQueryParams.safeParse(req.query);
  const status = params.success ? params.data.status : undefined;

  const allApps = await db.select().from(applicationsTable).orderBy(applicationsTable.createdAt);

  const filtered = status
    ? allApps.filter((a) => a.status === status)
    : allApps;

  res.json(filtered);
});

router.get("/applications/:id", async (req, res): Promise<void> => {
  const params = GetApplicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [application] = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.id, params.data.id));

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(application);
});

router.patch("/applications/:id/status", async (req, res): Promise<void> => {
  const params = UpdateApplicationStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const body = UpdateApplicationStatusBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [updated] = await db
    .update(applicationsTable)
    .set({ status: body.data.status })
    .where(eq(applicationsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  await notifyDiscord(
    `**USER STATUS UPDATED**\nName: ${updated.name}\nEmail: ${updated.email}\nNew Status: ${body.data.status.toUpperCase()}`
  ).catch(() => {});

  res.json(updated);
});

router.patch("/applications/:id/notes", async (req, res): Promise<void> => {
  const params = UpdateApplicationNotesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const body = UpdateApplicationNotesBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [updated] = await db
    .update(applicationsTable)
    .set({ notes: body.data.notes })
    .where(eq(applicationsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(updated);
});

export default router;
