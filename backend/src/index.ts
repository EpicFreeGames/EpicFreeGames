import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { rootRouter } from "./rootRouter";
import { createContext } from "./trpc";
import { envs } from "./configuration/env";
import { createServer } from "http";
import { discordRequestHandler } from "./discord/requestHandler";
import { PrismaClient } from "@prisma/client";
import { redirect } from "./redirector";

(async () => {
	const db = new PrismaClient();

	console.log("Connecting to DB...");
	await db.$connect();
	console.log("Connected to DB");

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
		} else if (
			envs.ENV === "notprod"
				? req.url?.startsWith("/redirect")
				: req.headers.host?.startsWith("redirect")
		) {
			redirect(req, res, db);
			return;
		} else {
			res.writeHead(404);
			res.end();
			return;
		}
	}).listen(port, () => console.log(`Listening on port ${port}`));
})();
