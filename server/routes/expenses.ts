import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { getUser } from "../kinde";

import getUserExpenses from convex

import { createExpenseSchema } from "../sharedTypes";

export const expensesRoute = new Hono()
	.get("/", getUser, async (c) => {
		const user = c.var.user;

		const expenses = await getUserExpenses(user.id)

		return c.json({ expenses: expenses });
	})
	.post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
		const expense = await c.req.valid("json");
		const user = c.var.user;

		const validatedExpense = insertContentSchema.parse({
			...expense,
			userId: user.id,
		});

		const result = await createExpense(validatedExpense)

		c.status(201);
		return c.json(result);
	});
