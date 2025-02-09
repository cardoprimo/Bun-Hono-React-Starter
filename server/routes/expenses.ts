import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { getUser } from "../kinde";

import { db } from "../db";
import {
	expenses as expenseTable,
	insertContentSchema,
} from "../db/schema/schema";
import { eq, desc, sum, and } from "drizzle-orm";

import { createExpenseSchema } from "../sharedTypes";

export const expensesRoute = new Hono()
	.get("/", getUser, async (c) => {
		const user = c.var.user;

		const expenses = await db
			.select()
			.from(expenseTable)
			.where(eq(expenseTable.userId, user.id))
			.orderBy(desc(expenseTable.createdAt))
			.limit(100);

		return c.json({ expenses: expenses });
	})
	.post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
		const expense = await c.req.valid("json");
		const user = c.var.user;

		const validatedExpense = insertContentSchema.parse({
			...expense,
			userId: user.id,
		});

		const result = await db
			.insert(expenseTable)
			.values(validatedExpense)
			.returning()
			.then((res) => res[0]);

		c.status(201);
		return c.json(result);
	});
