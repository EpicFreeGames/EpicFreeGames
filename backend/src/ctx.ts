import { Database } from "./db/db";
import { LoggerWithRequestId } from "./logger";
import { ulid } from "ulid";

export function getCtx(req: Request, db: Database) {
	return {
		req,
		db,
		logger: LoggerWithRequestId((req.headers.get("x-request-id") as string) ?? ulid()),
	};
}

export type Ctx = ReturnType<typeof getCtx>;
