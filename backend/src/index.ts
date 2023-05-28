import { env } from "./configuration/env";
import { getCtx } from "./ctx";
import { getMongo } from "./db/db";
import { discordHandler } from "./discord/discordHandler";
import { respondWith } from "./utils";

console.log("Connecting to MongoDB");
const db = await getMongo();
console.log("Connected to MongoDB");

const port = env.PORT || 8000;

Bun.serve({
	port,
	async fetch(request) {
		const ctx = getCtx(request, db);

		const response = await discordHandler(ctx);

		console.log("response", response);

		return response ?? respondWith(ctx, 200, "ok");
	},
});

console.log("Server started", { port, apiBase: env.DC_API_BASE, env: env.ENV });
