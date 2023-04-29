import { discordHandler } from "./discord/discordHandler";

Bun.serve({
	port: 8000,
	development: false,
	async fetch(req) {
		const response = await discordHandler(req);

		return response;
	},
});
