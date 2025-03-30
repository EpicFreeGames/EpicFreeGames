import { authRouter } from "./routers/auth-router";
import { gamesRouter } from "./routers/games-router";
import { sendRouter } from "./routers/send-router";
import { supportRouter } from "./routers/support-router";
import { router } from "./trpc";

export const rootRouter = router({
	games: gamesRouter,
	auth: authRouter,
	send: sendRouter,
	support: supportRouter,
});

export type RootRouter = typeof rootRouter;
