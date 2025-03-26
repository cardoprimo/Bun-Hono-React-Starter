import { createApp } from '../lib/create-app';

export const authRoute = createApp()
	.get('/login', async (c) => {
		if (c.var.clerkAuth?.userId) {
			console.log('already logged in', c.var.clerkAuth.userId);
			return c.redirect('/');
		}
		return c.redirect('/auth/login');
	})
	.get('/register', async (c) => {
		if (c.var.clerkAuth?.userId) {
			console.log('already logged in', c.var.clerkAuth.userId);
			return c.redirect('/');
		}
		return c.redirect('/auth/register');
	})
	.get('/logout', async (c) => {
		if (c.var.clerkAuth?.userId) {
			console.log('already logged in', c.var.clerkAuth.userId);
			return c.redirect('/');
		}
		return c.redirect('/auth/logout');
	})
	.get('/me', async (c) => {
		const userId = c.get('').var.clerkAuth?.userId;
		if (!userId) {
			console.log('not logged in');
			return c.redirect('/');
		}

		return c.json({ message: 'You are logged in.', userId });
	});
