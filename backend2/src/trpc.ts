import { TRPCError, initTRPC } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import superjson from "superjson";
import { Database } from "./db/db";
import { verifyToken } from "./auth";

const t = initTRPC.context<Context>().create({
	transformer: superjson,
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

const authMiddleware = middleware(async (props) => {
	console.log(props.ctx.req.headers.cookie);

	const tokenCookie = props.ctx.req.headers.cookie?.split("=")[1];
	const token = await verifyToken(tokenCookie ?? "");

	if (!token) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
		});
	}

	return props.next({
		...props,
		ctx: {
			...props.ctx,
			email: token.email,
		},
	});
});

export const authProcedure = publicProcedure.use(authMiddleware);

export function createContext(db: Database) {
	return (props: CreateHTTPContextOptions) => {
		return {
			req: props.req,
			res: props.res,
			db,
		};
	};
}

export type Context = ReturnType<ReturnType<typeof createContext>>;
