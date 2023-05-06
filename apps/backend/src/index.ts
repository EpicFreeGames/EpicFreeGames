import { createServer } from "node:http";

import { apiRouter, createContext } from "@efg/api";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";

import { discordHandler, isDiscordRequest } from "./discord/discordHandler";

const handler = createHTTPHandler({
	router: apiRouter,
	createContext,
});

createServer(async (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE,OPTIONS,HEAD");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, Content-Length, X-Requested-With"
	);
	res.setHeader("Access-Control-Allow-Credentials", "true");

	if (req.method === "OPTIONS") {
		res.writeHead(200);
		res.end();
		return;
	}

	if (isDiscordRequest(req)) {
		const { code, body } = await discordHandler(req);

		res.writeHead(code, body ? { "Content-Type": "application/json" } : undefined);

		if (body) {
			res.write(JSON.stringify(body));
		}

		res.end();
		return;
	}

	handler(req, res);
}).listen(5000, () => console.log("Server started on port 5000"));
