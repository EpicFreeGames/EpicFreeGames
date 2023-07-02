import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { rootRouter } from "./rootRouter";
import { createContext } from "./trpc";
import { createServer } from "http";

const port = 8000;
const trpcHandler = createHTTPHandler({
	router: rootRouter,
	createContext,
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

	if (req.url?.startsWith("/trpc")) {
		req.url = req.url.replace("/trpc", "");

		return trpcHandler(req, res);
	}
}).listen(port, () => console.log(`Listening on port ${port}`));
