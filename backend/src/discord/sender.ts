import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { envs } from "../configuration/env";
import { gameEmbed } from "./embeds/gameEmbed";
import { defaultLangauge, languages } from "./i18n/language";
import { currencies, defaultCurrency } from "./i18n/currency";
import {
	RESTPostAPIChannelMessageJSONBody,
	RESTPostAPIWebhookWithTokenJSONBody,
} from "discord-api-types/v10";
import { displayRole } from "./utils";

export async function sendWebhooks(db: PrismaClient, sendId: string) {
	const send = await db.send.findUnique({
		where: { id: sendId },
		include: { games: { include: { prices: true } } },
	});

	if (!send) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Send not found",
		});
	}

	let [servers, serverCount] = await Promise.all([
		db.discordServer.findMany({
			where: {
				createdAt: { lte: new Date() },
				channelUpdatedAt: { not: null, lte: new Date() },
				webhookId: { not: null },
				webhookToken: { not: null },
				channelId: { not: null },
			},
			take: 5000,
		}),
		db.discordServer.count({
			where: {
				createdAt: { lte: new Date() },
				channelUpdatedAt: { not: null, lte: new Date() },
				webhookId: { not: null },
				webhookToken: { not: null },
				channelId: { not: null },
			},
		}),
	]);

	if (!serverCount) {
		return console.log("WEBHOOKS ABORT - NO SERVERS");
	}

	console.log(`WEBHOOKS START - STARTING SEND TO ${serverCount} SERVERS`);

	let i = 0;
	let prevI = 0;
	let failed = 0;
	let succeeded = 0;
	let prevSucceed = 0;

	const statusLogInterval = setInterval(() => {
		console.log("WEBHOOKS STATUS", {
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

			const language =
				languages.get(server.languageCode ?? defaultLangauge.code) ?? defaultLangauge;
			const currency =
				currencies.get(server.currencyCode ?? defaultCurrency.code) ?? defaultCurrency;

			const gameEmbeds = send.games.map((game) => gameEmbed(game, language, currency));

			const body: RESTPostAPIWebhookWithTokenJSONBody = {
				embeds: gameEmbeds,
				...(server.roleId && { content: displayRole(server.roleId) }),
			};

			const searchParams = new URLSearchParams({ wait: "true" });
			if (server.threadId) {
				searchParams.append("threadId", server.threadId);
			}

			const url =
				envs.DC_API_BASE +
				`/webhooks/${server.webhookId}/${server.webhookToken}` +
				`?${searchParams.toString()}`;

			fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			})
				.then(async (r) => {
					const json = await r.json().catch(() => null);

					if (!r.ok) {
						failed++;
						console.log(i, "WEBHOOKS NOT OK", json, r.status);
					} else {
						succeeded++;
					}

					db.discordSendLog
						.create({
							data: {
								error: json,
								statusCode: r.status,
								success: r.ok,
								type: "WEBHOOK",
								send: { connect: { id: sendId } },
								server: { connect: { id: server.id } },
							},
						})
						.catch(() => null);
				})
				.catch((e) => {
					console.log(i, "WEBHOOKS ERROR", e);

					failed++;

					db.discordSendLog
						.create({
							data: {
								error: e,
								statusCode: e.status ?? 500,
								success: false,
								type: "WEBHOOK",
								send: { connect: { id: sendId } },
								server: { connect: { id: server.id } },
							},
						})
						.catch(() => null);
				});
		}

		const lastServer = servers.at(-1);
		if (!lastServer) {
			break;
		}

		servers = await db.discordServer.findMany({
			where: {
				createdAt: { lte: new Date() },
				channelUpdatedAt: { not: null, lte: new Date() },
				webhookId: { not: null },
				webhookToken: { not: null },
				channelId: { not: null },
			},
			orderBy: { id: "asc" },
			take: 5000,
			cursor: { id: lastServer.id },
			skip: 1,
		});
	}

	console.log("WEBHOOKS DONE");
	clearInterval(statusLogInterval);
}

export async function sendMessages(db: PrismaClient, sendId: string) {
	const send = await db.send.findUnique({
		where: { id: sendId },
		include: { games: { include: { prices: true } } },
	});

	if (!send) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Send not found",
		});
	}

	let [servers, serverCount] = await Promise.all([
		db.discordServer.findMany({
			where: {
				createdAt: { lte: new Date() },
				channelUpdatedAt: { not: null, lte: new Date() },
				webhookId: null,
				webhookToken: null,
				channelId: { not: null },
			},
			take: 5000,
		}),
		db.discordServer.count({
			where: {
				createdAt: { lte: new Date() },
				channelUpdatedAt: { not: null, lte: new Date() },
				webhookId: null,
				webhookToken: null,
				channelId: { not: null },
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
			await new Promise((r) => setTimeout(r, 25));

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
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			})
				.then(async (r) => {
					const json = await r.json().catch(() => null);

					if (!r.ok) {
						failed++;
						console.log(i, "MESSAGES NOT OK", json, r.status);
					} else {
						succeeded++;
					}

					db.discordSendLog
						.create({
							data: {
								error: json,
								statusCode: r.status,
								success: r.ok,
								type: "WEBHOOK",
								send: { connect: { id: sendId } },
								server: { connect: { id: server.id } },
							},
						})
						.catch(() => null);
				})
				.catch((e) => {
					console.log(i, "MESSAGES ERROR", e);

					failed++;

					db.discordSendLog
						.create({
							data: {
								error: e,
								statusCode: e.status ?? 500,
								success: false,
								type: "WEBHOOK",
								send: { connect: { id: sendId } },
								server: { connect: { id: server.id } },
							},
						})
						.catch(() => null);
				});
		}

		const lastServer = servers.at(-1);
		if (!lastServer) {
			break;
		}

		servers = await db.discordServer.findMany({
			where: {
				createdAt: { lte: new Date() },
				channelUpdatedAt: { not: null, lte: new Date() },
				webhookId: null,
				webhookToken: null,
				channelId: { not: null },
			},
			orderBy: { id: "asc" },
			take: 5000,
			cursor: { id: lastServer.id },
			skip: 1,
		});
	}

	console.log("MESSAGES DONE");
	clearInterval(statusLogInterval);
}
