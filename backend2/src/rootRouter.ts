import { authRouter } from "./routers/auth-router";
import { gamesRouter } from "./routers/games-router";
import { testRouter } from "./routers/test-router";
import { router } from "./trpc";

export const rootRouter = router({
	games: gamesRouter,
	auth: authRouter,
	test: testRouter,
});

export type RootRouter = typeof rootRouter;
