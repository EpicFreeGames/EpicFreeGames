import { authRouter } from "./routers/auth-router";
import { gamesRouter } from "./routers/games-router";
import { sendRouter } from "./routers/send-router";
import { router } from "./trpc";

export const rootRouter = router({
	games: gamesRouter,
	auth: authRouter,
	send: sendRouter,
});

export type RootRouter = typeof rootRouter;
