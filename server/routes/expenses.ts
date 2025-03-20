import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { getUser } from "../kinde";

import { zCreateExpenseSchema } from "@server/lib/zSchemas";

import { ConvexClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const convex = new ConvexClient(import.meta.env.CONVEX_URL);

const expensesRoute = new Hono();

expensesRoute.get("/", getUser, async (c) => {
	console.log("expensesRoute.get");
	const authUser = c.var.user;
	if (!authUser) {
		// redirect to home
		c.status(401);
		return c.redirect("/");
	}

	const convexId = authUser.id as Id<"users">;

	const user = await convex.query(api.users.getConvexUser, { id: convexId });
	if (!user) {
		return c.json({ expenses: [] });
	}

	const expenses = await convex.query(api.expenses.getExpenses, {
		userId: user._id,
	});

	return c.json({ expenses: expenses });
});
expensesRoute.post(
	"/",
	getUser,
	zValidator("json", zCreateExpenseSchema),
	async (c) => {
		const expense = c.req.valid("json");
		const authUser = c.var.user;
		if (!authUser) {
			return c.json("Kinde Unauthorized");
		}
		const convexId = authUser.id as Id<"users">;

		const user = await convex.query(api.users.getConvexUser, { id: convexId });
		if (!user) {
			return c.json("Convex Unauthorized");
		}

		const newExpense = await convex.mutation(api.expenses.createExpense, {
			userId: user._id,
			title: expense.title,
		});

		c.status(201);
		return c.json(newExpense);
	}
);

export default expensesRoute;
