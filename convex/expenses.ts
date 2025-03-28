import type { Doc, Id } from './_generated/dataModel';
import type { QueryCtx } from './_generated/server';
import invariant from 'tiny-invariant';
import { mutation, query } from './_generated/server';
import {
	createExpenseSchema,
	deleteExpenseSchema,
	selectExpenseSchema,
	selectUserExpensesSchema,
	updateExpenseSchema,
} from './schema';

function withoutSystemFields<T extends { _creationTime: number; _id: Id<any> }>(
	doc: T,
) {
	const { _id, _creationTime, ...rest } = doc;
	return rest;
}

async function getUserExpenses(ctx: QueryCtx, userId: Id<'users'>) {
	const expenses = await ctx.db
		.query('expenses')
		.withIndex('userid_index', (exp) => exp.eq('userId', userId))
		.collect();

	return expenses;
}

export const getExpenses = query({
	args: selectUserExpensesSchema,
	handler: async (ctx, { clerkId }) => {
		invariant(clerkId, 'clerkId required');
		const user = await ctx.db
			.query('users')
			.withIndex('clerkid_index', (u) => u.eq('clerkId', clerkId))
			.collect();
		return await getUserExpenses(ctx, user[0]._id);
	},
});

export const getExpense = query({
	args: selectExpenseSchema,
	handler: async (ctx, { id }) => {
		const expense = await ensureExpenseExists(ctx, id);
		return withoutSystemFields(expense);
	},
});

export const createExpense = mutation({
	args: createExpenseSchema,
	handler: async (ctx, expense) => {
		return await ctx.db.insert('expenses', { ...expense });
	},
});

export const updateExpense = mutation({
	args: updateExpenseSchema,
	handler: async (ctx, expense) => {
		const existingExpense = await ensureExpenseExists(ctx, expense.id);
		await ctx.db.patch(expense.id, existingExpense);
	},
});

async function ensureExpenseExists(
	ctx: QueryCtx,
	expenseId: Id<'expenses'>,
): Promise<Doc<'expenses'>> {
	const expense = await ctx.db.get(expenseId);

	invariant(expense, `missing item: ${expenseId}`);
	return expense;
}

export const deleteExpense = mutation({
	args: deleteExpenseSchema,
	handler: async (ctx, { id }) => {
		const expense = await ensureExpenseExists(ctx, id);
		await ctx.db.delete(expense._id);
	},
});
