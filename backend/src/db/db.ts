import { env } from "../configuration/env";
import { DbGame, DbSending, DbSendingLog, DbServer, DbSession, DbUser, DbLog } from "./types";
import { MongoClient } from "mongodb";

const mongo = new MongoClient(env.MONGO_URL);

export const getMongo = async () => {
	await mongo.connect();

	const db = mongo.db(`efg-db-${env.ENV}`);

	db.createIndex("logs", { r: 1 });
	db.createIndex("logs", { d: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // retain for 30 days

	return {
		games: db.collection<DbGame>("games"),
		users: db.collection<DbUser>("users"),
		servers: db.collection<DbServer>("servers"),
		sendings: db.collection<DbSending>("sendings"),
		sendingLogs: db.collection<DbSendingLog>("sendingLogs"),
		sessions: db.collection<DbSession>("sessions"),
		logs: db.collection<DbLog>("logs"),
	};
};

export type Database = Awaited<ReturnType<typeof getMongo>>;
