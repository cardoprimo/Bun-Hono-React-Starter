import { updateExpenseSchema } from "~/convex/schema";
import { z } from "zod";

export const createExpenseSchema = insertContentSchema.omit({
	userId: true,
	createdAt: true,
	id: true,
});

export type CreateExpense = z.infer<typeof createExpenseSchema>;
