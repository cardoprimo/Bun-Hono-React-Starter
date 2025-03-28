import type { Infer } from 'convex/values';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// Define the expenses schema using Convex
const schema = defineSchema({
	expenses: defineTable({
		userId: v.id('users'),
		title: v.string(),
		amount: v.number(),
		date: v.string(),
	}).index('userid_index', ['userId']),
	users: defineTable({
		clerkId: v.string(),
		expenseIds: v.array(v.id('expenses')),
	})
		.index('expensesid_index', ['expenseIds'])
		.index('clerkid_index', ['clerkId']),
});

export default schema;

const expenses = schema.tables.expenses.validator;
const users = schema.tables.users.validator;

export type Expense = Infer<typeof expenses>;
export type User = Infer<typeof users>;

export const selectUserExpensesSchema = v.object({
	clerkId: v.string(),
});

export const selectExpenseSchema = v.object({
	id: v.id('expenses'),
});

export const createExpenseSchema = v.object({
	userId: expenses.fields.userId,
	title: v.string(),
	amount: v.number(),
	date: v.string(),
});

export const updateExpenseSchema = v.object({
	id: v.id('expenses'),
	title: v.string(),
});

export const deleteExpenseSchema = v.object({
	id: v.id('expenses'),
});

export const updateUserSchema = v.object({
	id: v.id('users'),
});

export const createUserSchema = v.object({
	clerkId: users.fields.clerkId,
});

export const getConvexUserFromClerkIdSchema = v.object({
	clerkId: users.fields.clerkId,
});

export type CreateExpense = Infer<typeof createExpenseSchema>;
export type SelectExpenses = Infer<typeof selectUserExpensesSchema>;
export type SelectExpense = Infer<typeof selectExpenseSchema>;
export type DeleteExpense = Infer<typeof deleteExpenseSchema>;
