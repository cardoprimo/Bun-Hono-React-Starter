import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

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
		PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
	},
	runtimeEnv: {
		// eslint-disable-next-line node/prefer-global/process
		NODE_ENV: process.env.NODE_ENV,
	},
	emptyStringAsUndefined: true,
});
