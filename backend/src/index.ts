import { env } from "./configuration/env";
import { getMongo } from "./db/db";
import { discordHandler } from "./discord/discordHandler";
import { Logger } from "./logger";

const db = await getMongo();

Bun.serve({
	port: env.PORT,
	async fetch(request) {
		const response = await discordHandler(request, db);

		return response;
	},
});

Logger.info("Server started", { port: env.PORT, apiBase: env.DC_API_BASE });
