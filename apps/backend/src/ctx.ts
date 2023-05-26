import type { IncomingMessage, ServerResponse } from "http";
import { ulid } from "ulid";

import type { Database } from "@efg/db";

import { LoggerWithRequestId } from "./logger";

export function getCtx(req: IncomingMessage, res: ServerResponse<IncomingMessage>, db: Database) {
	return {
		req,
		res,
		db,
		logger: LoggerWithRequestId((req.headers["x-request-id"] as string) ?? ulid()),
	};
}

export type Ctx = ReturnType<typeof getCtx>;
