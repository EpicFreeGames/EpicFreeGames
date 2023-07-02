import { initTRPC } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import superjson from "superjson";

const t = initTRPC.create({
	transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

export async function createContext(props: CreateHTTPContextOptions) {
	return {
		req: props.req,
		res: props.res,
	};
}

export type Context = ReturnType<typeof createContext>;
