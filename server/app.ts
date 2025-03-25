import { serveStatic } from 'hono/bun';
import { createApp } from './lib/create-app';
import { authRoute } from './routes/auth';
import { expensesRoute } from './routes/expenses';
import { jsonNotFound } from './utils/notFound';
import { jsonOnError } from './utils/onError';

const app = createApp();

app.get('/', c => c.text('Hello, world!'));

const _apiRoutes = app
	.basePath('/api')
	.route('/expenses', expensesRoute)
	.route('/', authRoute)
	.notFound(jsonNotFound)
	.onError(jsonOnError);

app.get('*', serveStatic({ root: './frontend/dist' }));
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

export default app;
export type ApiRoutes = typeof _apiRoutes;
