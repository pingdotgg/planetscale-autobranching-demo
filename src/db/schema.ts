import { InferSelectModel, sql } from "drizzle-orm";
import { int, mysqlTableCreator, text, timestamp } from "drizzle-orm/mysql-core";

export const sqliteTable = mysqlTableCreator((name) => `with-drizzle_${name}`);

export const files = sqliteTable("files", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  key: text("key").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  uploadedBy: int("uploaded_by").notNull(),
});

export type File = InferSelectModel<typeof files>;
