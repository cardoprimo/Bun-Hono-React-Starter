/* eslint-disable node/prefer-global/process */
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(['development', 'test', 'production'])
			.default('development'),
		CLERK_JWT_ISSUER_URL: z.string().url().default('https://clerk.com'),
		CLERK_SECRET_KEY: z.string().startsWith('sk_').default('sk_test_'),
		CONVEX_DEPLOYMENT: z.string(),
		CONVEX_URL: z.string().url(),
	},
	clientPrefix: 'VITE_',
	client: {
		VITE_CLERK_PUBLISHABLE_KEY: z.string(),
	},
	runtimeEnv: {
		NODE_ENV: import.meta.env.NODE_ENV || 'development',
		CLERK_JWT_ISSUER_URL: import.meta.env.CLERK_JWT_ISSUER_URL,
		CLERK_SECRET_KEY: import.meta.env.CLERK_SECRET_KEY,
		CONVEX_DEPLOYMENT: import.meta.env.CONVEX_DEPLOYMENT,
		CONVEX_URL: import.meta.env.CONVEX_URL,
		VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY,
	},
	emptyStringAsUndefined: true,
});
