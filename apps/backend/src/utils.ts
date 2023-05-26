import type { ServerResponse } from "node:http";

import { Logger } from "./logger";

export function objToStr(obj: object) {
	return JSON.stringify(obj, null, 2);
}

export function respondWith(res: ServerResponse, code: number, details?: any) {
	Logger.debug("Responding with", { code, details });

	res.statusCode = code;

	if (details) {
		res.setHeader("Content-Type", "application/json");

		if (typeof details === "string") {
			res.write(JSON.stringify({ [code < 400 ? "error" : "message"]: details }));
		} else {
			res.write(JSON.stringify(details));
		}
	}

	res.end();
}
