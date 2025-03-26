import type { QueryClient } from '@tanstack/react-query';
import { NavBar } from '@/components/navbar';
import { Toaster } from '@/components/ui/sonner';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: Root,
});

function Root() {
	return (
		<>
			<NavBar />
			<hr />
			<div className="p-2 max-w-2xl m-auto">
				<Outlet />
			</div>
			<Toaster />
			{/* <TanStackRouterDevtools /> */}
		</>
	);
}
