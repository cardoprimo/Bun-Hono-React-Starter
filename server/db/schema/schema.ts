import { text, numeric, index, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const expenses = sqliteTable(
	"content",
	{
		id: numeric("id").primaryKey(),
		userId: text("user_id").notNull(),
		title: text("title").notNull(),
		createdAt: text("created_at")
			.$defaultFn(() => new Date().toISOString())
			.notNull(),
	},
	(content) => [index("name_idx").on(content.userId)]
);

// Schema for inserting a user - can be used to validate API requests
export const insertContentSchema = createInsertSchema(expenses, {
	title: z.string().min(3, { message: "Title must be at least 3 characters" }),
});
// Schema for selecting a Expenses - can be used to validate API responses
export const selectContentSchema = createSelectSchema(expenses);
