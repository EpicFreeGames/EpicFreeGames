import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { createServer } from "http";
import { getMongo } from "./db/db";
import { discordRequestHandler } from "./discord/requestHandler";
import { rootRouter } from "./rootRouter";
import { createContext } from "./trpc";
import { envs } from "./configuration/env";

(async () => {
	console.log("Connecting to MongoDB");
	const db = await getMongo();
	console.log("Connected to MongoDB");

	const port = 8000;
	const trpcHandler = createHTTPHandler({
		router: rootRouter,
		createContext: createContext(db),
	});

	createServer((req, res) => {
		res.setHeader("Access-Control-Allow-Origin", envs.FRONT_BASE);
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		res.setHeader("Access-Control-Allow-Credentials", "true");

		if (req.method === "OPTIONS") {
			res.writeHead(200);
			res.end();
			return;
		}

		if (req.url?.startsWith("/discord")) {
			return discordRequestHandler(req, res, db);
		} else if (req.url?.startsWith("/trpc")) {
			req.url = req.url.replace("/trpc", "");

			return trpcHandler(req, res);
		}
	}).listen(port, () => console.log(`Listening on port ${port}`));
})();
