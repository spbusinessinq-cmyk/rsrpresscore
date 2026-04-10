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

  const updates: Partial<typeof applicationsTable.$inferInsert> = {
    status: body.data.status,
  };

  if (body.data.status === "accepted") {
    updates.accessCode = crypto.randomBytes(4).toString("hex").toUpperCase();
  }

  const [updated] = await db
    .update(applicationsTable)
    .set(updates)
    .where(eq(applicationsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  if (body.data.status === "accepted") {
    await notifyDiscord(
      `**APPLICATION ACCEPTED**\nName: ${updated.name}\nEmail: ${updated.email}\nAccess Code: ${updated.accessCode}`
    );
  }

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
