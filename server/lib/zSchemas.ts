import z from 'zod';

export const zCreateExpenseSchema = z.object({
	userId: z.string(),
	title: z.string(),
});
