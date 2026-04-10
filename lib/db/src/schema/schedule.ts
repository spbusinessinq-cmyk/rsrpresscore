import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scheduleItemsTable = pgTable("schedule_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location"),
  eventTime: timestamp("event_time", { withTimezone: true }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertScheduleItemSchema = createInsertSchema(scheduleItemsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertScheduleItem = z.infer<typeof insertScheduleItemSchema>;
export type ScheduleItem = typeof scheduleItemsTable.$inferSelect;
