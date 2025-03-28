import z from 'zod';

export const zCreateExpenseSchema = z.object({
	userId: z.string(),
	title: z.string(),
	amount: z.number(),
	date: z.string(),
});

export const zDeleteExpenseSchema = z.object({
	id: z.string(),
});
