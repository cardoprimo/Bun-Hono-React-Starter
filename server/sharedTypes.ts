import type { z } from 'zod';
import type {
	zCreateExpenseSchema,
	zDeleteExpenseSchema,
} from './lib/zSchemas';

export type createExpenseSchema = z.infer<typeof zCreateExpenseSchema>;
export type deleteExpenseSchema = z.infer<typeof zDeleteExpenseSchema>;
