import { Router, type IRouter } from "express";
import { db, bulletinsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  CreateBulletinBody,
  UpdateBulletinParams,
  UpdateBulletinBody,
  DeleteBulletinParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/bulletins", async (_req, res): Promise<void> => {
  const bulletins = await db
    .select()
    .from(bulletinsTable)
    .orderBy(desc(bulletinsTable.createdAt));
  res.json(bulletins);
});

router.post("/bulletins", async (req, res): Promise<void> => {
  const parsed = CreateBulletinBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [bulletin] = await db
    .insert(bulletinsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(bulletin);
});

router.put("/bulletins/:id", async (req, res): Promise<void> => {
  const params = UpdateBulletinParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const body = UpdateBulletinBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [updated] = await db
    .update(bulletinsTable)
    .set(body.data)
    .where(eq(bulletinsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Bulletin not found" });
    return;
  }

  res.json(updated);
});

router.delete("/bulletins/:id", async (req, res): Promise<void> => {
  const params = DeleteBulletinParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  await db.delete(bulletinsTable).where(eq(bulletinsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
