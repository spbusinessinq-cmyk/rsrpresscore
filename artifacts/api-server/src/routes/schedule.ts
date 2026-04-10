import { Router, type IRouter } from "express";
import { db, scheduleItemsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  CreateScheduleItemBody,
  DeleteScheduleItemParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/schedule", async (_req, res): Promise<void> => {
  const items = await db
    .select()
    .from(scheduleItemsTable)
    .orderBy(asc(scheduleItemsTable.eventTime));
  res.json(items);
});

router.post("/schedule", async (req, res): Promise<void> => {
  const parsed = CreateScheduleItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [item] = await db
    .insert(scheduleItemsTable)
    .values({
      title: parsed.data.title,
      location: parsed.data.location ?? null,
      eventTime: new Date(parsed.data.eventTime),
      notes: parsed.data.notes ?? null,
    })
    .returning();

  res.status(201).json(item);
});

router.delete("/schedule/:id", async (req, res): Promise<void> => {
  const params = DeleteScheduleItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  await db
    .delete(scheduleItemsTable)
    .where(eq(scheduleItemsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
