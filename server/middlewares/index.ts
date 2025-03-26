import { api } from '@/convex/_generated/api';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';
import { env } from '../env';

const convexUserMiddleware = createMiddleware(async (c, next) => {
	const clerkUser = getAuth(c);
	if (!clerkUser) {
		return c.json({ error: 'Unauthorized clerk' }, 401);
	}
	const convexUser = (api.users.getConvexUser, clerkUser.userId);
	if (!convexUser) {
		// create convex user
		await (api.users.getConvexUser, { clerkId: clerkUser.userId });
		return c.json({ error: 'Unauthorized convex' }, 401);
	}
	c.set('userId', convexUser);
	await next();
});

export const middlewares = [
	clerkMiddleware({
		publishableKey: env.PUBLIC_CLERK_PUBLISHABLE_KEY,
		secretKey: env.CLERK_SECRET_KEY,
	}),
	convexUserMiddleware,
	logger(),
	cors(),
	requestId(),
];
