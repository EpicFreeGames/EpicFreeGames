import { authRouter } from "./routers/auth-router";
import { gamesRouter } from "./routers/games-router";
import { router } from "./trpc";

export const rootRouter = router({
	games: gamesRouter,
	auth: authRouter,
});

export type RootRouter = typeof rootRouter;
