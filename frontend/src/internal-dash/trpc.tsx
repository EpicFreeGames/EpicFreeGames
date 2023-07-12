import {
	TRPCClientError,
	createTRPCReact,
	httpBatchLink,
	inferReactQueryProcedureOptions,
} from "@trpc/react-query";
import type { RootRouter } from "../../../backend/src/rootRouter";
import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import { useAuthContext } from "./auth";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const trpc = createTRPCReact<RootRouter>();

export function ApiProvider(props: { children: ReactNode }) {
	const { logout } = useAuthContext();

	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			transformer: superjson,
			links: [
				httpBatchLink({
					url: "http://localhost:8000/trpc",
					fetch: async (input, init) => {
						const response = await fetch(input, { ...init, credentials: "include" });

						if (response.status === 401) {
							logout();
						}

						return response;
					},
				}),
			],
		})
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
		</trpc.Provider>
	);
}

export type ReactQueryOptions = inferReactQueryProcedureOptions<RootRouter>;
export type RouterInputs = inferRouterInputs<RootRouter>;
export type RouterOutputs = inferRouterOutputs<RootRouter>;
