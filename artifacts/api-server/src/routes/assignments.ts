import { Router, type IRouter } from "express";
import { db, assignmentsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  CreateAssignmentBody,
  UpdateAssignmentParams,
  UpdateAssignmentBody,
  DeleteAssignmentParams,
  ListAssignmentsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/assignments", async (req, res): Promise<void> => {
  const params = ListAssignmentsQueryParams.safeParse(req.query);
  const visibility = params.success ? params.data.visibility : undefined;

  const all = await db
    .select()
    .from(assignmentsTable)
    .orderBy(desc(assignmentsTable.createdAt));

  const filtered = visibility
    ? all.filter((a) => a.visibility === visibility)
    : all;

  res.json(filtered);
});

router.post("/assignments", async (req, res): Promise<void> => {
  const parsed = CreateAssignmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [assignment] = await db
    .insert(assignmentsTable)
    .values({
      title: parsed.data.title,
      location: parsed.data.location,
      eventTime: parsed.data.eventTime ? new Date(parsed.data.eventTime) : null,
      priority: parsed.data.priority,
      summary: parsed.data.summary,
      status: parsed.data.status,
      visibility: parsed.data.visibility,
    })
    .returning();

  res.status(201).json(assignment);
});

router.patch("/assignments/:id", async (req, res): Promise<void> => {
  const params = UpdateAssignmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const body = UpdateAssignmentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (body.data.title !== undefined) updates.title = body.data.title;
  if (body.data.location !== undefined) updates.location = body.data.location;
  if (body.data.eventTime !== undefined)
    updates.eventTime = body.data.eventTime ? new Date(body.data.eventTime) : null;
  if (body.data.priority !== undefined) updates.priority = body.data.priority;
  if (body.data.summary !== undefined) updates.summary = body.data.summary;
  if (body.data.status !== undefined) updates.status = body.data.status;
  if (body.data.visibility !== undefined) updates.visibility = body.data.visibility;
  if (body.data.claimedBy !== undefined) updates.claimedBy = body.data.claimedBy;

  const [updated] = await db
    .update(assignmentsTable)
    .set(updates)
    .where(eq(assignmentsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Assignment not found" });
    return;
  }

  res.json(updated);
});

router.delete("/assignments/:id", async (req, res): Promise<void> => {
  const params = DeleteAssignmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  await db.delete(assignmentsTable).where(eq(assignmentsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
