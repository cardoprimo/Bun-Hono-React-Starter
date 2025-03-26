import type { AppBindings } from './types';
import { Hono } from 'hono';
import { middlewares } from '../middlewares';
import { notFound } from '../utils/notFound';
import { onError } from '../utils/onError';

export function createRouter() {
	return new Hono<AppBindings>({
		strict: false,
	});
}

export function createApp() {
	const app = createRouter();
	app.use('*', ...middlewares);
	app.notFound(notFound);
	app.onError(onError);
	return app;
}
