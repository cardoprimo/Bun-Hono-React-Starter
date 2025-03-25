import { z } from 'zod';

export const createSchema = z.object({
	userId: z.string(),
	title: z.string(),
});

export type createExpenseSchema = z.infer<typeof createSchema>;
