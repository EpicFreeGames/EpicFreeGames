import { createServer } from "node:http";

import { apiRouter, createContext } from "@efg/api";
import { getMongo } from "@efg/db";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";

import { discordHandler, isDiscordRequest } from "./discord/discordHandler";

const db = await getMongo();

const handler = createHTTPHandler({
	router: apiRouter,
	createContext: createContext(db),
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
		await discordHandler(req, res, db);
		return;
	}

	handler(req, res);
}).listen(10000, () => console.log("Server started on port 10000"));
