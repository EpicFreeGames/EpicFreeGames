import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { envs } from "../configuration/env";

export async function sendWebhooks(db: PrismaClient, sendId: string) {
	const send = await db.send.findUnique({
		where: { id: sendId },
		include: { games: true },
	});

	if (!send) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Send not found",
		});
	}

	let [servers, serverCount] = await Promise.all([
		db.discord_server.findMany({
			where: {
				created_at: { lte: new Date() },
				channel_updated_at: { not: null, lte: new Date() },
				webhook_id: { not: null },
				webhook_token: { not: null },
			},
			take: 5000,
		}),
		db.discord_server.count({
			where: {
				created_at: { lte: new Date() },
				channel_updated_at: { not: null, lte: new Date() },
				webhook_id: { not: null },
				webhook_token: { not: null },
			},
		}),
	]);

	let i = 0;
	let prevI = 0;
	let failed = 0;
	let succeeded = 0;
	let prevSucceed = 0;

	setInterval(() => {
		console.log("WEBHOOKS", {
			i,
			failed,
			succeeded,
			total: serverCount,
			speedPerSec: succeeded - prevSucceed,
			speedPerSecI: i - prevI,
		});

		prevSucceed = succeeded;
		prevI = i;
	}, 1000);

	while (!!servers.length) {
		for (const server of servers) {
			i++;
			await new Promise((r) => setTimeout(r, 2));

			const url = envs.DC_API_BASE + `/webhooks/${server.webhook_id}/${server.webhook_token}`;

			fetch(url, {
				method: "GET",
			})
				.then(async (r) => {
					const json = await r.json().catch(() => null);

					if (!r.ok) {
						failed++;
						console.log(i, "NOT OK", json, r.status);
					} else {
						succeeded++;
					}

					db.discord_send_log
						.create({
							data: {
								error: json,
								statusCode: r.status,
								success: r.ok,
								type: "WEBHOOK",
								send: { connect: { id: sendId } },
								discord_server: { connect: { id: server.id } },
							},
						})
						.catch(() => null);
				})
				.catch((e) => {
					console.log(i, "ERROR", e);

					failed++;

					db.discord_send_log
						.create({
							data: {
								error: e,
								statusCode: e.status ?? 500,
								success: false,
								type: "WEBHOOK",
								send: { connect: { id: sendId } },
								discord_server: { connect: { id: server.id } },
							},
						})
						.catch(() => null);
				});
		}

		const lastServer = servers.at(-1);
		if (!lastServer) {
			break;
		}

		servers = await db.discord_server.findMany({
			where: {
				created_at: { lte: new Date() },
				channel_updated_at: { not: null, lte: new Date() },
				webhook_id: { not: null },
				webhook_token: { not: null },
			},
			orderBy: { id: "asc" },
			take: 5000,
			cursor: { id: lastServer.id },
			skip: 1,
		});
	}
}
