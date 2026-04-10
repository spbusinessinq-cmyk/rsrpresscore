import { Router, type IRouter } from "express";
import { db, reportsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { SubmitReportBody } from "@workspace/api-zod";
import { notifyDiscord } from "../lib/notify";

const router: IRouter = Router();

router.get("/reports", async (_req, res): Promise<void> => {
  const reports = await db
    .select()
    .from(reportsTable)
    .orderBy(desc(reportsTable.createdAt));
  res.json(reports);
});

router.post("/reports", async (req, res): Promise<void> => {
  const parsed = SubmitReportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [report] = await db
    .insert(reportsTable)
    .values({
      title: parsed.data.title,
      body: parsed.data.body,
      sourceLinks: parsed.data.sourceLinks ?? null,
      mediaLink: parsed.data.mediaLink ?? null,
      authorName: parsed.data.authorName,
      authorEmail: parsed.data.authorEmail,
    })
    .returning();

  await notifyDiscord(
    `**FIELD REPORT SUBMITTED**\nTitle: ${report.title}\nAuthor: ${report.authorName} (${report.authorEmail})`
  );

  res.status(201).json(report);
});

export default router;
