import { Router, type IRouter } from "express";
import { db, messagesTable } from "@workspace/db";
import { asc } from "drizzle-orm";
import { SendMessageBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/messages", async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(messagesTable)
    .orderBy(asc(messagesTable.createdAt));
  res.json(messages);
});

router.post("/messages", async (req, res): Promise<void> => {
  const parsed = SendMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [message] = await db
    .insert(messagesTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(message);
});

export default router;
