import { env } from '../shared/env';

export default {
	providers: [
		{
			domain: env.CLERK_JWT_ISSUER_URL,
			applicationID: 'convex',
		},
	],
};
