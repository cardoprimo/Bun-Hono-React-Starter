import type { Context } from 'hono';
import type { JSONObject } from 'hono/utils/types';
import { UNAUTHORIZED } from './http-status-codes';
import { UNAUTHORIZED as UNAUTHORIZED_MESSAGE } from './http-status-phrases';

export function jsonUnauthorized(c: Context, data?: JSONObject) {
	return c.json(
		{
			message: `${UNAUTHORIZED_MESSAGE} - ${c.req.path}`,
			data: `${data ? JSON.stringify(data) : ''}`,
		},
		UNAUTHORIZED,
	);
}

export function jsonOk(c: any, data: JSONObject) {
	return c.json(data, 200);
}
