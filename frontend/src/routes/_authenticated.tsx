import { Login } from '@/components/auth';
import { userQueryOptions } from '@/lib/api';
import { createFileRoute, Outlet } from '@tanstack/react-router';

// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
	beforeLoad: async ({ context }) => {
		const queryClient = context.queryClient;

		try {
			const data = await queryClient.fetchQuery(userQueryOptions);
			return data;
		} catch (e) {
			console.error(e);
			return { user: null };
		}
	},
	component: Component,
});

function Component() {
	const { user } = Route.useRouteContext();
	if (!user) {
		console.log('not logged in');
		return <Login />;
	}

	return <Outlet />;
}
