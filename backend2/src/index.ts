import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { rootRouter } from "./rootRouter";
import { createContext } from "./trpc";
import { createServer } from "http";
import { discordRequestHandler } from "./discord/requestHandler";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const port = 8000;
const trpcHandler = createHTTPHandler({
	router: rootRouter,
	createContext: createContext(db),
});

createServer((req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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
