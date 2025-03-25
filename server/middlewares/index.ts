import { clerkMiddleware } from '@hono/clerk-auth';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';

export const middlewares = [
	clerkMiddleware(),
	logger(),
	cors(),
	requestId(),
];
