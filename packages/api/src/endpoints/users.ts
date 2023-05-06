import { protectedProcedure, router } from "../trpc";
import { users } from "@efg/db";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const userEndpoints = router({
	me: protectedProcedure.query(async ({ ctx }) => {
		const user = (
			await ctx.db.select().from(users).where(eq(users.id, ctx.userId)).limit(1)
		).at(0);

		if (!user) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
		}

		return user;
	}),
});
