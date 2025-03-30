import type { User } from '@/convex/schema';
import { api } from '@/convex/_generated/api';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { ConvexHttpClient } from 'convex/browser';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';
// import { env } from '../../shared/env';
import { onError } from '../utils/onError';

const convexUserMiddleware = createMiddleware(async (c, next) => {
	const convex = new ConvexHttpClient(import.meta.env.VITE_CONVEX_URL);

	const clerkUser = getAuth(c);
	if (!clerkUser?.userId) {
		c.set('user', null);
		await next();
		return;
	}

	const clerkUserId: User['clerkId'] = clerkUser.userId;

	const convexUser = (api.users.getConvexUserFromClerkId, clerkUserId);
	if (convexUser) {
		c.set('user', convexUser);
		await next();
	} else {
		// create convex user
		try {
			const newUser = await convex.mutation(api.users.createUser, {
				clerkId: clerkUserId,
			});
			c.set('user', newUser);
			await next();
			if (!newUser) {
				return c.json(onError, 500);
			}
		} catch {
			return c.json({ error: 'Unauthorized convex' }, 401);
		}
	}
});

export const middlewares = [
	clerkMiddleware({
		publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
		secretKey: import.meta.env.CLERK_SECRET_KEY,
	}),
	convexUserMiddleware,
	logger(),
	cors(),
	requestId(),
];
