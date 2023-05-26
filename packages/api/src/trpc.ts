import { verifyToken } from "./token";
import type { Database } from "@efg/db";
import { TRPCError, type inferAsyncReturnType, initTRPC } from "@trpc/server";
import { type CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import superjson from "superjson";

export function createContext(db: Database) {
	return async (opts: CreateHTTPContextOptions) => {
		const token = opts.req.headers.authorization?.replace("Bearer ", "");

		const userId = token
			? await verifyToken(token)
					.then((v) => v.payload.userId)
					.catch(() => null)
			: null;

		return { db, userId };
	};
}

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
	transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.userId) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing Bearer token" });
	}

	return next({
		ctx: { userId: ctx.userId },
	});
});

export const protectedProcedure = t.procedure.use(isAuthed);
