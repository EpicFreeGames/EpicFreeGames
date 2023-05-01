import { gamesRouter } from "./endpoints/games";
import { env } from "./env";
import { Root, Router } from "./router/router";

const root = new Root();
const apiRouter = new Router();

apiRouter.use("/games", gamesRouter);

root.use("/api", apiRouter);

Bun.serve({
	port: env.PORT || 8000,
	development: false,
	async fetch(req) {
		const response = await root.handle(req);

		return response;
	},
});
