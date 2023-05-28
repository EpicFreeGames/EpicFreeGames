import { env } from "../configuration/env";
import { DbGame, DbServer, DbLog, DbSend, DbSendLog } from "./types";
import { MongoClient } from "mongodb";

const mongo = new MongoClient(env.MONGO_URL);

export const getMongo = async () => {
	await mongo.connect();

	const db = mongo.db(`efg-db-${env.ENV}`);

	db.createIndex("logs", { r: 1 });
	db.createIndex("logs", { d: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 }); // retain for 7 days

	return {
		games: db.collection<DbGame>("games"),
		servers: db.collection<DbServer>("servers"),
		sends: db.collection<DbSend>("sends"),
		logs: db.collection<DbLog>("logs"),
		sendLogs: db.collection<DbSendLog>("sendLogs"),
	};
};

export type Database = Awaited<ReturnType<typeof getMongo>>;
