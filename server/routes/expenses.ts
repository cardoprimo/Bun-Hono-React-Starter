import type { Id } from '../../convex/_generated/dataModel';
import { zValidator } from '@hono/zod-validator';

import { zCreateExpenseSchema } from '@server/lib/zSchemas';

import { ConvexClient } from 'convex/browser';
import { Hono } from 'hono';
import { api } from '../../convex/_generated/api';

const convex = new ConvexClient(import.meta.env.CONVEX_URL);

export const expensesRoute = new Hono()
	.get('/', async (c) => {
		const authUser = c.var.clerkAuth?.userId;
		if (!authUser) {
			// redirect to home
			c.status(401);
			return c.redirect('/');
		}

		const convexId = authUser as Id<'users'>;

		const user = await convex.query(api.users.getConvexUser, { id: convexId });
		if (!user) {
			return c.json({ expenses: [] });
		}

		const expenses = await convex.query(api.expenses.getExpenses, {
			userId: user._id,
		});

		return c.json({ expenses });
	})
	.post('/', zValidator('json', zCreateExpenseSchema), async (c) => {
		const expense = c.req.valid('json');
		const authUser = c.var.clerkAuth?.userId;
		if (!authUser) {
			return c.json({ error: 'Clerk Unauthorized' }, 401);
		}
		const convexId = authUser as Id<'users'>;

		const user = await convex.query(api.users.getConvexUser, { id: convexId });
		if (!user) {
			return c.json({ error: 'Convex Unauthorized' }, 401);
		}

		try {
			const newExpense = await convex.mutation(api.expenses.createExpense, {
				userId: user._id,
				title: expense.title,
			});

			return c.json({ expense: newExpense }, 201);
		} catch (e) {
			console.error(e);
			return c.json({ error: 'Failed to create expense' }, 500);
		}
	});
