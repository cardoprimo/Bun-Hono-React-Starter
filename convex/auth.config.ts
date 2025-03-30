// import { env } from '../shared/env';

export default {
	providers: [
		{
			// eslint-disable-next-line node/prefer-global/process
			domain: process.env.CLERK_JWT_ISSUER_URL,
			applicationID: 'convex',
		},
	],
};
