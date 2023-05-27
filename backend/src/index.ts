import { env } from "./configuration/env";
import { getMongo } from "./db/db";
import { discordHandler } from "./discord/discordHandler";

console.log("Connecting to MongoDB");
const db = await getMongo();
console.log("Connected to MongoDB");

const port = env.PORT || 8000;

Bun.serve({
	port,
	async fetch(request) {
		const response = await discordHandler(request, db);

		return response;
	},
});

console.log("Server started", { port, apiBase: env.DC_API_BASE, env: env.ENV });
