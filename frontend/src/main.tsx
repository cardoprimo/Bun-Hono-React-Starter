import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexQueryClient } from '@convex-dev/react-query';
import { env } from '@shared/env';
import {
	MutationCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import {
	createRouter as createTanStackRouter,
	RouterProvider,
} from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import React from 'react';
import ReactDOM from 'react-dom/client';

import toast from 'react-hot-toast';

import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { NotFound } from './components/NotFound';
// Import the generated route tree
import { routeTree } from './routeTree.gen';
import './index.css';

const convexQueryClient = new ConvexQueryClient(import.meta.env.CONVEX_URL);

// Create a client
const queryClient: QueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryKeyHashFn: convexQueryClient.hashFn(),
			queryFn: convexQueryClient.queryFn(),
		},
	},
	mutationCache: new MutationCache({
		onError: (error) => {
			toast(error.message, { className: 'bg-red-500 text-white' });
		},
	}),
});
convexQueryClient.connect(queryClient);

const clerkPublicKey = env.VITE_CLERK_PUBLISHABLE_KEY;

const convex = new ConvexReactClient(env.VITE_CONVEX_URL);

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
			<ClerkProvider publishableKey={clerkPublicKey}>
				<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
					<QueryClientProvider client={queryClient}>
						{children}
					</QueryClientProvider>
				</ConvexProviderWithClerk>
			</ClerkProvider>
		),
	}),
	queryClient,
);

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
