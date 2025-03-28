import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { createUserSchema, getConvexUserFromClerkIdSchema } from './schema';

export const getConvexUser = query({
	args: v.object({
		id: v.id('users'),
	}),
	handler: async (ctx, { id }) => {
		const user = await ctx.db.get(id);
		return user;
	},
});

export const createUser = mutation({
	args: createUserSchema,
	handler: async (ctx, { clerkId }) => {
		const id = await ctx.db.insert('users', { expenseIds: [], clerkId });
		const user = await ctx.db.get(id);
		return user;
	},
});

export const getConvexUserFromClerkId = query({
	args: getConvexUserFromClerkIdSchema,
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query('users')
			.withIndex('clerkid_index', (u) => u.eq('clerkId', args.clerkId))
			.collect();

		return user[0];
	},
});
