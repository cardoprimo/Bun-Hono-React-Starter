import { z } from 'zod'

export const createSchema = z.object({
  userId: z.string(),
  title: z.string(),
})

export type CreateExpense = z.infer<typeof createSchema>
