import type { Id } from '../../convex/_generated/dataModel';
import { zValidator } from '@hono/zod-validator';

import {
	zCreateExpenseSchema,
	zDeleteExpenseSchema,
} from '@server/lib/zSchemas';

import { ConvexClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';
import { env } from '../env';
import { createApp } from '../lib/create-app';
import { jsonNotFound } from '../utils/notFound';
import { jsonOnError } from '../utils/onError';
import { jsonOk, jsonUnauthorized } from '../utils/responses';

const convex = new ConvexClient(env.CONVEX_URL);

export const expensesRoute = createApp()
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
				amount: expense.amount,
				date: expense.date,
			});

			return c.json({ expense: newExpense }, 201);
		} catch (e) {
			console.error(e);
			return c.json({ error: 'Failed to create expense' }, 500);
		}
	})
	.delete(
		':id{[0-9]+}',
		zValidator('param', zDeleteExpenseSchema),
		async (c) => {
			const user = c.var.user;

			const expenseId = c.req.param('id') as Id<'expenses'>;

			const expense = await convex.query(api.expenses.getExpense, {
				id: expenseId,
			});
			if (!expense) {
				return jsonNotFound;
			}

			if (!user) {
				return jsonUnauthorized(c);
			}

			if (!user.expenseIds.includes(expenseId)) {
				return jsonUnauthorized(c, {
					message: `User unauthorized to delete expense`,
				});
			}

			try {
				await convex.mutation(api.expenses.deleteExpense, {
					id: expenseId,
				});
				return jsonOk(c, { id: expenseId, message: 'Expense deleted' });
			} catch (e) {
				console.error(e);
				return jsonOnError;
			}
		},
	);
