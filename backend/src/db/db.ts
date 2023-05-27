import { env } from "../configuration/env";
import type {
	DbCommandLog,
	DbGame,
	DbSending,
	DbSendingLog,
	DbServer,
	DbSession,
	DbUser,
} from "./types";
import { MongoClient } from "mongodb";

const mongo = new MongoClient(env.MONGO_URL);

export const getMongo = async () => {
	await mongo.connect();

	const db = mongo.db(`efg-db-${env.ENV}`);

	return {
		games: db.collection<DbGame>("games"),
		users: db.collection<DbUser>("users"),
		servers: db.collection<DbServer>("servers"),
		commandLogs: db.collection<DbCommandLog>("commandLogs"),
		sendings: db.collection<DbSending>("sendings"),
		sendingLogs: db.collection<DbSendingLog>("sendingLogs"),
		sessions: db.collection<DbSession>("sessions"),
	};
};

export type Database = Awaited<ReturnType<typeof getMongo>>;
