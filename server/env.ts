import { createEnv } from '@t3-oss/env-core';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(['development', 'test', 'production']),
		CLERK_JWT_ISSUER_URL: z.string().url(),
		CLERK_SECRET_KEY: z.string().startsWith('sk_'),
		CONVEX_DEPLOYMENT: z.string(),
		CONVEX_URL: z.string().url(),
	},
	clientPrefix: 'PUBLIC_',
	client: {
		PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
	},
	runtimeEnv: {
		// eslint-disable-next-line node/prefer-global/process
		NODE_ENV: process.env.NODE_ENV || 'development',
		CLERK_JWT_ISSUER_URL: process.env.CLERK_JWT_ISSUER_URL,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
		CONVEX_URL: process.env.CONVEX_URL,
		PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.PUBLIC_CLERK_PUBLISHABLE_KEY,
	},
});
