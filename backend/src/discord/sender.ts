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
		db.discord_server.findMany({
			where: {
				created_at: { lte: new Date() },
				channel_updated_at: { not: null, lte: new Date() },
				webhook_id: { not: null },
				webhook_token: { not: null },
				channel_id: { not: null },
			},
			take: 5000,
		}),
		db.discord_server.count({
			where: {
				created_at: { lte: new Date() },
				channel_updated_at: { not: null, lte: new Date() },
				webhook_id: { not: null },
				webhook_token: { not: null },
				channel_id: { not: null },
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
				languages.get(server.language_code ?? defaultLangauge.code) ?? defaultLangauge;
			const currency =
				currencies.get(server.currency_code ?? defaultCurrency.code) ?? defaultCurrency;

			const gameEmbeds = send.games.map((game) => gameEmbed(game, language, currency));

			const body: RESTPostAPIWebhookWithTokenJSONBody = {
				embeds: gameEmbeds,
				...(server.role_id && { content: displayRole(server.role_id) }),
			};

			const searchParams = new URLSearchParams({ wait: "true" });
			if (server.thread_id) {
				searchParams.append("thread_id", server.thread_id);
			}

			const url =
				envs.DC_API_BASE +
				`/webhooks/${server.webhook_id}/${server.webhook_token}` +
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
					console.log(i, "WEBHOOKS ERROR", e);

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
				channel_id: { not: null },
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
		db.discord_server.findMany({
			where: {
				created_at: { lte: new Date() },
				channel_updated_at: { not: null, lte: new Date() },
				webhook_id: null,
				webhook_token: null,
				channel_id: { not: null },
			},
			take: 5000,
		}),
		db.discord_server.count({
			where: {
				created_at: { lte: new Date() },
				channel_updated_at: { not: null, lte: new Date() },
				webhook_id: null,
				webhook_token: null,
				channel_id: { not: null },
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
				languages.get(server.language_code ?? defaultLangauge.code) ?? defaultLangauge;
			const currency =
				currencies.get(server.currency_code ?? defaultCurrency.code) ?? defaultCurrency;

			const gameEmbeds = send.games.map((game) => gameEmbed(game, language, currency));

			const url = envs.DC_API_BASE + `/channels/${server.channel_id}/messages`;
			const body: RESTPostAPIChannelMessageJSONBody = {
				embeds: gameEmbeds,
				...(server.role_id && { content: displayRole(server.role_id) }),
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
					console.log(i, "MESSAGES ERROR", e);

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
				webhook_id: null,
				webhook_token: null,
				channel_id: { not: null },
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
