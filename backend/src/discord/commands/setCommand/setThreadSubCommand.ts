import { DiscordServer } from "@prisma/client";
import {
	APIChatInputApplicationCommandGuildInteraction,
	ApplicationCommandOptionType,
	ChannelType,
	InteractionResponseType,
	MessageFlags,
	RESTGetAPIChannelResult,
	RESTGetAPIChannelWebhooksResult,
	RESTPostAPIChannelWebhookResult,
} from "discord-api-types/v10";
import { constants } from "../../../configuration/constants";
import { envs } from "../../../configuration/env";
import { DiscordRequestContext } from "../../context";
import { discordApi } from "../../discordApi";
import { genericErrorEmbed } from "../../embeds/errors";
import { channelSetEmbed, maxNumOfWebhooks, missingPermsEmbed } from "../../embeds/setChannel";
import { settingsEmbed } from "../../embeds/settings";
import { Currency } from "../../i18n/currency";
import { Language } from "../../i18n/language";
import { hasPermsOnChannel } from "../../perms/hasPermsOnChannel";
import { PermissionString } from "../../perms/types";
import { editInteractionResponse } from "../../utils";
import { getTypedOption } from "../_getTypedOption";
import { gameEmbed } from "../../embeds/gameEmbed";

export const setThreadSubCommand = async (props: {
	ctx: DiscordRequestContext;
	i: APIChatInputApplicationCommandGuildInteraction;
	language: Language;
	currency: Currency;
	dbServer: DiscordServer;
}) => {
	try {
		const threadOption = getTypedOption(
			props.i,
			ApplicationCommandOptionType.Channel,
			"thread"
		);
		const selectedThreadId = threadOption?.value;
		if (!threadOption || !selectedThreadId) return;

		props.ctx.respondWith(200, {
			type: InteractionResponseType.DeferredChannelMessageWithSource,
			data: { flags: MessageFlags.Ephemeral },
		});

		const threadResult = await discordApi<RESTGetAPIChannelResult>(props.ctx, {
			method: "GET",
			path: `/channels/${selectedThreadId}`,
		});

		// TODO: handle no permission error differently
		if (threadResult.error) {
			props.ctx.log("Failed to set thread - failed to get thread", {
				error: threadResult.error,
				selectedThreadId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});

			return;
		}

		// TODO: handle thread type error differently
		if (threadResult.data?.type !== ChannelType.PublicThread) {
			props.ctx.log("Failed to set thread - thread is not a public thread", {
				selectedThreadId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});

			return;
		}

		const selectedThreadParentId = threadResult.data.parent_id;

		if (!selectedThreadParentId) {
			props.ctx.log("Failed to set thread - thread has no parent_id", {
				selectedThreadId,
				selectedThreadParentId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});

			return;
		}

		const hasPermsResult = await hasPermsOnChannel(
			props.ctx,
			props.i.guild_id,
			selectedThreadParentId,
			[
				"VIEW_CHANNEL",
				"MANAGE_WEBHOOKS",
				"SEND_MESSAGES_IN_THREADS",
				"EMBED_LINKS",
				...(props.dbServer?.roleId ? ["MENTION_EVERYONE" as PermissionString] : []), // check only if server has a set role
			]
		);

		if (hasPermsResult.error) {
			props.ctx.log("Failed to set thread - failed to check perms on parent", {
				error: hasPermsResult.error,
				selectedThreadId,
				selectedThreadParentId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});

			return;
		}

		if (hasPermsResult.hasPerms === false) {
			props.ctx.log("Failed to set thread - missing perms on parent", {
				selectedThreadId,
				selectedThreadParentId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					missingPermsEmbed(
						selectedThreadParentId,
						props.language,
						hasPermsResult.details
					),
				],
			});

			return;
		}

		const parentChannelsWebhooksResult = await discordApi<RESTGetAPIChannelWebhooksResult>(
			props.ctx,
			{
				method: "GET",
				path: `/channels/${selectedThreadParentId}/webhooks`,
			}
		);

		// TODO: handle no permission error differently
		if (parentChannelsWebhooksResult.error) {
			props.ctx.log("Failed to set thread - failed to get webhooks on parent", {
				error: parentChannelsWebhooksResult.error,
				selectedThreadId,
				selectedThreadParentId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});

			return;
		}

		// delete the previous saved webhook if new channel !== old channel
		// that cannot be used since the channel is changing
		if (
			props.dbServer?.webhookId &&
			props.dbServer.webhookToken &&
			props.dbServer.channelId !== selectedThreadParentId
		) {
			discordApi(props.ctx, {
				method: "DELETE",
				path: `/webhooks/${props.dbServer.webhookId}/${props.dbServer.webhookToken}`,
			});
		}

		// check if a webhook already exists on the channel
		// won't almost ever happen, but just in case, could save an api call
		let webhook = parentChannelsWebhooksResult.data.find(
			(w) => w.user?.id === envs.DC_CLIENT_ID
		);

		if (!webhook) {
			if (parentChannelsWebhooksResult.data.length >= 10) {
				props.ctx.log("Failed to set thread - too many webhooks on parent", {
					selectedThreadId,
					selectedThreadParentId,
					amount: parentChannelsWebhooksResult.data.length,
				});

				await editInteractionResponse(props.ctx, props.i, {
					flags: MessageFlags.Ephemeral,
					embeds: [maxNumOfWebhooks(props.language)],
				});

				return;
			}

			const newWebhookResult = await discordApi<RESTPostAPIChannelWebhookResult>(props.ctx, {
				method: "POST",
				path: `/channels/${selectedThreadParentId}/webhooks`,
				body: {
					name: constants.webhookName,
					avatar: constants.base64Logo,
				},
			});

			if (newWebhookResult.error) {
				props.ctx.log("Failed to set thread - failed to create a new webhook on parent", {
					selectedThreadId,
					selectedThreadParentId,
					error: newWebhookResult.error,
				});

				await editInteractionResponse(props.ctx, props.i, {
					flags: MessageFlags.Ephemeral,
					embeds: [
						genericErrorEmbed({
							language: props.language,
							requestId: props.ctx.requestId,
						}),
					],
				});

				return;
			}

			webhook = newWebhookResult.data;
		}

		// just in case a miracle happens
		if (!webhook.token) {
			props.ctx.log("Failed to set thread - created webhook doesn't have a token", {
				selectedThreadId,
				selectedThreadParentId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});
		}

		const updatedDbServer = await props.ctx.db.discordServer.update({
			where: { id: props.dbServer.id },
			data: {
				channelId: selectedThreadParentId,
				threadId: selectedThreadId,
				webhookId: webhook.id,
				webhookToken: webhook.token,
				channelUpdatedAt: new Date(),
			},
		});

		if (!updatedDbServer.channelId) {
			props.ctx.log("Failed to set thread - channel id is falsy after update", {
				selectedThreadId,
				selectedThreadParentId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});

			return;
		}

		if (!updatedDbServer.threadId) {
			props.ctx.log("Failed to set thread - thread id is falsy after update", {
				selectedThreadId,
				selectedThreadParentId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});

			return;
		}

		await editInteractionResponse(props.ctx, props.i, {
			flags: MessageFlags.Ephemeral,
			embeds: [
				channelSetEmbed(props.language, updatedDbServer.threadId),
				settingsEmbed(updatedDbServer, props.language, props.currency),
			],
		});

		// send current free games to the set thread
		const now = new Date();
		const freeGames = await props.ctx.db.game.findMany({
			where: {
				confirmed: true,
				startDate: { lte: now },
				endDate: { gte: now },
			},
			include: { prices: true },
		});

		if (freeGames && freeGames.length) {
			discordApi(props.ctx, {
				method: "POST",
				path: `/webhooks/${updatedDbServer.webhookId}/${updatedDbServer.webhookToken}?thread_id=${updatedDbServer.threadId}`,
				body: {
					embeds: freeGames.map((g) => gameEmbed(g, props.language, props.currency)),
				},
			});
		}
	} catch (e) {
		props.ctx.log("Failed to set thread - catched an error", {
			error: e,
		});
	}
};
