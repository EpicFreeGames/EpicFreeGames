import { envs } from "../configuration/env";
import { DbGame, DbDiscordServer, DbSend, DbSendLog } from "./dbTypes";
import { MongoClient } from "mongodb";

const mongo = new MongoClient(envs.MONGO_URL);

export const getMongo = async () => {
	await mongo.connect();

	await mongo.db().command({ ping: 1 });

	const db = mongo.db(`efg-db-${envs.ENV}`);

	db.createIndex("discordServers", { id: 1 }, { unique: true });

	db.createIndex("games", { startDate: 1, endDate: 1 });

	db.createIndex("sendLogs", { sendId: 1, "server._id": 1 }, { unique: true });

	return {
		games: db.collection<DbGame>("games"),
		discordServers: db.collection<DbDiscordServer>("discordServers"),
		sends: db.collection<DbSend>("sends"),
		sendLogs: db.collection<DbSendLog>("sendLogs"),
	};
};

export type Database = Awaited<ReturnType<typeof getMongo>>;
