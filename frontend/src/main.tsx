import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
	createRouter as createTanStackRouter,
	RouterProvider,
} from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { env } from '@server/env';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

import './index.css';

// openAuth

// Create a client
const queryClient = new QueryClient(); // ?

// Create a new router instance
// const router = createRouter({ routeTree, context: { queryClient } }); ç
const router = routerWithQueryClient(
	createTanStackRouter({
		routeTree,
		defaultPreload: 'intent',
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: () => <NotFound />,
		context: { queryClient },
		Wrap: ({ children }) => (
			<ConvexProvider client={convexQueryClient.convexClient}>
				{children}
			</ConvexProvider>
		),
		scrollRestoration: true,
	}),
	queryClient,
);

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
const clerkPublicKey = env.PUBLIC_CLERK_PUBLISHABLE_KEY;

const convex = new ConvexReactClient(env.CONVEX_URL);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ClerkProvider publishableKey={clerkPublicKey}>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	</React.StrictMode>,
);
