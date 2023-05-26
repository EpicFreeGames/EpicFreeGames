import { protectedProcedure, router } from "../trpc";

export const userEndpoints = router({
	me: protectedProcedure.query(async ({ ctx }) => {}),
});
