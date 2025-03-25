import { z } from 'zod';
import app from './app';

const ServeEnv = z.object({
	PORT: z
		.string()
		.regex(/^\d+$/, 'Port must be a numeric string')
		.default('3000')
		.transform(Number),
});
// eslint-disable-next-line node/prefer-global/process
const ProcessEnv = ServeEnv.parse(process.env);

const server = Bun.serve({
	port: ProcessEnv.PORT,
	hostname: '0.0.0.0',
	fetch: app.fetch,
});

// eslint-disable-next-line no-console
console.log(`server running http://localhost:${server.port}`);
