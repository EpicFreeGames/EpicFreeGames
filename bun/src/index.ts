import { discordHandler } from "./discord/discordHandler";
import { gamesRouter } from "./endpoints/games";
import { rootHandler } from "./router/handler";

Bun.serve({
	port: 8000,
	development: false,
	async fetch(req) {
		const response = await rootHandler("/api", req, discordHandler, gamesRouter);

		return (
			response ||
			new Response(JSON.stringify({ error: "Endpoint does not exist" }), { status: 404 })
		);
	},
});
