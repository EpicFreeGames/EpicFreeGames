import { Database } from "../../db/db";
import { DbGame, DbSend } from "../../db/types";
import { addDays } from "date-fns";

export async function enqueueSends(db: Database) {
	const game: DbGame = {
		name: "test-game",
		displayName: "Test Game",
		path: "/test-game",
		confirmed: true,
		startDate: new Date(),
		endDate: addDays(new Date(), 7),
		imageUrl: "https://example.com/image.png",
		prices: [
			{
				currencyCode: "USD",
				formattedValue: "$1.00",
				value: 1,
			},
		],
	};

	const gameRes = await db.games.insertOne(game);

	const send: DbSend = {
		gameIds: [gameRes.insertedId],
	};

	const sendRes = await db.sends.insertOne(send);

	const servers = db.servers.find({
		channelId: { $ne: null },
	});

	console.time("loop");

	for await (const server of servers) {
		console.log("looping on", server.id);

		await db.sendLogs.insertOne({
			sendId: sendRes.insertedId,
			server,
			attempts: [],
		});
	}

	console.timeEnd("loop");
}

export async function send(db: Database) {
	const send = await db.sends.findOne({});

	if (!send) {
		console.log("ABORTING SEND: no send");
		return;
	}

	const games = await db.games.find({ _id: { $in: send.gameIds } }).toArray();

	if (!games.length) {
		console.log("ABORTING SEND: no games");

		return;
	}

	const sendLogs = db.sendLogs.find({ sendId: send._id });

	console.time("send loop");

	for await (const sendLog of sendLogs) {
		console.log("send looping on", sendLog._id);

		new Promise((resolve) => setTimeout(resolve, 300)).then(() => {
			db.sendLogs.updateOne(
				{ _id: sendLog._id },
				{
					$push: {
						attempts: { date: new Date(), error: null, server: sendLog.server },
					},
				}
			);
		});
	}

	console.timeEnd("send loop");
}
