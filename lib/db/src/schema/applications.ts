import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  city: text("city").notNull().default(""),
  state: text("state").notNull().default(""),
  areasOfOperation: text("areas_of_operation").notNull().default(""),
  experienceLevel: text("experience_level").notNull().default(""),
  workTypes: text("work_types").array().notNull().default([]),
  intent: text("intent").notNull().default(""),
  links: text("links"),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  accessCode: text("access_code"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({
  id: true,
  status: true,
  notes: true,
  accessCode: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
