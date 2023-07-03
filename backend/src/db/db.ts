import { env } from "../configuration/env";
import { DbGame, DbDiscordServer, DbLog, DbSend, DbSendLog } from "./types";
import { MongoClient } from "mongodb";

const mongo = new MongoClient(env.MONGO_URL);

export const getMongo = async () => {
	await mongo.connect();

	const db = mongo.db(`efg-db-${env.ENV}`);

	db.createIndex("logs", { r: 1 });
	db.createIndex("logs", { d: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 }); // retain for 7 days

	db.createIndex("servers", { id: 1 }, { unique: true });

	db.createIndex("games", { startDate: 1, endDate: 1 });

	db.createIndex("sendLogs", { sendId: 1, "server._id": 1 }, { unique: true });

	return {
		games: db.collection<DbGame>("games"),
		servers: db.collection<DbDiscordServer>("servers"),
		sends: db.collection<DbSend>("sends"),
		logs: db.collection<DbLog>("logs"),
		sendLogs: db.collection<DbSendLog>("sendLogs"),
	};
};

export type Database = Awaited<ReturnType<typeof getMongo>>;
