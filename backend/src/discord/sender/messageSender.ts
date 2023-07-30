import { PrismaClient } from "@prisma/client";
import { envs } from "../../configuration/env";
import { gameEmbed } from "../embeds/gameEmbed";
import { defaultLangauge, languages } from "../i18n/language";
import { currencies, defaultCurrency } from "../i18n/currency";
import { RESTPostAPIChannelMessageJSONBody } from "discord-api-types/v10";
import { displayRole } from "../utils";
import { SendForSending } from "../../routers/send-router";
import { senderLogError } from "./senderLog";

function getDbServers(props: { db: PrismaClient; sendId: string; lastServerId?: string }) {
	return props.db.discordServer.findMany({
		where: {
			channelId: { not: null },
			webhookId: null,
			webhookToken: null,
			createdAt: { lte: new Date() },
			channelUpdatedAt: { not: null, lte: new Date() },
			sendLogs: {
				none: {
					sendId: props.sendId,
					success: true,
					AND: [{ statusCode: { lt: 500 } }, { statusCode: { not: 429 } }],
				},
			},
		},
		orderBy: { id: "asc" },
		take: 5000,
		...(props.lastServerId && {
			cursor: { id: props.lastServerId },
			skip: 1,
		}),
	});
}

export async function sendMessages(db: PrismaClient, send: SendForSending) {
	let [servers, serverCount] = await Promise.all([
		getDbServers({ db, sendId: send.id }),
		db.discordServer.count({
			where: {
				createdAt: { lte: new Date() },
				channelUpdatedAt: { not: null, lte: new Date() },
				webhookId: null,
				webhookToken: null,
				channelId: { not: null },
				sendLogs: {
					none: { sendId: send.id, success: true },
				},
			},
		}),
	]);

	if (!serverCount) {
		return console.log("MESSAGES ABORT - NO SERVERS");
	}

	console.log(`MESSAGES START - STARTING SEND TO ${serverCount} SERVERS`);

	let i = 0;
	let prevI = 0;
	let failed = 0;
	let succeeded = 0;
	let prevSucceed = 0;

	const statusLogInterval = setInterval(() => {
		console.log("MESSAGES STATUS", {
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
			const innerI = i;
			await new Promise((r) => setTimeout(r, 30));

			const language =
				languages.get(server.languageCode ?? defaultLangauge.code) ?? defaultLangauge;
			const currency =
				currencies.get(server.currencyCode ?? defaultCurrency.code) ?? defaultCurrency;

			const gameEmbeds = send.games.map((game) => gameEmbed(game, language, currency));

			const url = envs.DC_API_BASE + `/channels/${server.channelId}/messages`;
			const body: RESTPostAPIChannelMessageJSONBody = {
				embeds: gameEmbeds,
				...(server.roleId && { content: displayRole(server.roleId) }),
			};

			fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bot ${envs.DC_TOKEN}`,
				},
				body: JSON.stringify(body),
			})
				.then(async (r) => {
					const result = await r.json().catch(() => null);

					if (!r.ok) {
						failed++;
						senderLogError({
							index: innerI,
							serverId: server.id,
							type: "message",
							ctx: `not ok with status ${r.status}`,
							error: result,
						});

						if (r.status < 500 && r.status !== 429) {
							db.discordServer
								.update({
									where: { id: server.id },
									data: {
										channelId: null,
										threadId: null,
										webhookId: null,
										webhookToken: null,
									},
								})
								.catch((e) => {
									senderLogError({
										index: innerI,
										serverId: server.id,
										type: "message",
										ctx: "failed to update db server",
										error: e,
									});
								});
						}
					} else {
						succeeded++;
					}

					db.discordSendLog
						.create({
							data: {
								result: JSON.stringify(result),
								statusCode: r.status,
								success: r.ok,
								type: "MESSAGE",
								send: { connect: { id: send.id } },
								server: { connect: { id: server.id } },
							},
						})
						.catch((e) =>
							senderLogError({
								index: innerI,
								serverId: server.id,
								type: "message",
								ctx: "failed to insert sendLog",
								error: e,
							})
						);
				})
				.catch((e) => {
					senderLogError({
						index: innerI,
						serverId: server.id,
						type: "message",
						ctx: "catched fetch",
						error: e,
					});

					failed++;

					db.discordSendLog
						.create({
							data: {
								result: e?.toString(),
								statusCode: e.status ?? 500,
								success: false,
								type: "MESSAGE",
								send: { connect: { id: send.id } },
								server: { connect: { id: server.id } },
							},
						})
						.catch(() =>
							senderLogError({
								index: innerI,
								serverId: server.id,
								type: "message",
								ctx: "failed to insert sendLog",
								error: e,
							})
						);

					db.discordServer
						.update({
							where: { id: server.id },
							data: {
								channelId: null,
								threadId: null,
								webhookId: null,
								webhookToken: null,
							},
						})
						.catch((dbErr) =>
							senderLogError({
								index: innerI,
								serverId: server.id,
								type: "message",
								ctx: "failed to update db server",
								error: dbErr,
							})
						);
				});
		}

		const lastServer = servers.at(-1);
		if (!lastServer) {
			break;
		}

		servers = await getDbServers({ db, sendId: send.id, lastServerId: lastServer.id });
	}

	console.log("MESSAGES DONE");
	clearInterval(statusLogInterval);
}
