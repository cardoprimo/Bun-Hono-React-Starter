import { v } from 'convex/values';
import { internalQuery, query } from './_generated/server';

export const getConvexUser = query({
	args: v.object({
		id: v.id('users'),
	}),
	handler: async (ctx, { id }) => {
		const user = await ctx.db.get(id);
		return user;
	},
});

export const create;

export const getConvexUserFromClerkId = internalQuery({
	args: { clerkId: v.id('users') },
	handler: async (ctx, args) => {
		await ctx.db
			.query('users')
			.withIndex('by_id', (u) => u.eq('_id', args.clerkId))
			.collect();
	},
});
