import schema, {
	createExpenseSchema,
	updateExpenseSchema,
	deleteExpenseSchema,
	selectExpenseSchema,
} from "@convex/schema";
import z from "zod";

export const zCreateExpenseSchema = z.object({
	userId: z.string(),
	title: z.string(),
});
