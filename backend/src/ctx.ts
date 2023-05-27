import { Database } from "./db/db";
import { Logger } from "./logger";
import { ulid } from "ulid";

export type RequestId = string & { __brand: "RequestId" };

function createRequestId() {
	return ulid() as RequestId;
}

export function getCtx(req: Request, db: Database) {
	const requestId = createRequestId();

	return {
		req,
		db,
		requestId,
		log: Logger(db, requestId),
	};
}

export type Ctx = ReturnType<typeof getCtx>;
