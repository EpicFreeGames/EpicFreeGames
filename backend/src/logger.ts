import { RequestId } from "./ctx";
import { Database } from "./db/db";
import { DbLog } from "./db/types";

export function Logger(db: Database, requestId: RequestId) {
	return (message: string, context?: any) => {
		const date = new Date();

		console.log(`${date.toISOString()} ${requestId} ${message}`);

		const log: DbLog = {
			d: date,
			m: message,
			r: requestId,
			c: context,
		};

		db.logs.insertOne(log);
	};
}
