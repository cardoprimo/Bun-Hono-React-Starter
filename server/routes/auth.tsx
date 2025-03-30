import { createApp } from '../lib/create-app';

export const authRoute = createApp()
	.get('/login', async (c) => {
		return c.redirect('/_authenticated');
	})
	.get('/register', async (c) => {
		if (c.var.clerkAuth?.userId) {
			return c.redirect('/');
		}
		return c.redirect('/auth/register');
	})
	.get('/logout', async (c) => {
		if (c.var.clerkAuth?.userId) {
			return c.redirect('/');
		}
		return c.redirect('/auth/logout');
	})
	.get('/me', async (c) => {
		const user = c.get('user');
		if (!user) {
			return c.redirect('/');
		}

		return c.json({ message: `You are logged in., ${user.clerkId}` });
	});
