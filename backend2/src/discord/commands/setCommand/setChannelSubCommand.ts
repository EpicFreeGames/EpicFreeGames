import {
	APIChatInputApplicationCommandGuildInteraction,
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
	RESTGetAPIChannelWebhooksResult,
	RESTPostAPIChannelWebhookResult,
} from "discord-api-types/v10";
import { constants } from "../../../configuration/constants";
import { envs } from "../../../configuration/env";
import { DbDiscordServer } from "../../../db/dbTypes";
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

export const setChannelSubCommand = async (props: {
	ctx: DiscordRequestContext;
	i: APIChatInputApplicationCommandGuildInteraction;
	language: Language;
	currency: Currency;
	dbServer: DbDiscordServer;
}) => {
	try {
		props.ctx.respondWith(200, {
			type: InteractionResponseType.DeferredChannelMessageWithSource,
			data: { flags: MessageFlags.Ephemeral },
		});

		const channelIdOption = getTypedOption(
			props.i,
			ApplicationCommandOptionType.Channel,
			"channel"
		);
		if (!channelIdOption) return;

		const selectedChannelId = channelIdOption.value;

		const permsResult = await hasPermsOnChannel(
			props.ctx,
			props.i.guild_id,
			selectedChannelId,
			[
				"VIEW_CHANNEL",
				"MANAGE_WEBHOOKS",
				"EMBED_LINKS",
				...(props.dbServer?.roleId ? ["MENTION_EVERYONE" as PermissionString] : []),
			]
		);

		if (permsResult.error) {
			props.ctx.log("Failed to check perms on channel", {
				cause: permsResult.cause,
				guildId: props.i.guild_id,
				selectedChannelId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});

			return;
		}

		if (permsResult.hasPerms === false) {
			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [missingPermsEmbed(selectedChannelId, props.language, permsResult.details)],
			});

			return;
		}

		const selectedChannelsWebhookResult = await discordApi<RESTGetAPIChannelWebhooksResult>(
			props.ctx,
			{
				method: "GET",
				path: `/channels/${selectedChannelId}/webhooks`,
			}
		);

		if (selectedChannelsWebhookResult.error) {
			props.ctx.log("Failed to get webhooks on channel", {
				error: selectedChannelsWebhookResult.error,
				guildId: props.i.guild_id,
				selectedChannelId,
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
			props.dbServer.channelId !== selectedChannelId
		) {
			discordApi(props.ctx, {
				method: "DELETE",
				path: `/webhooks/${props.dbServer.webhookId}/${props.dbServer.webhookToken}`,
			});
		}

		// check if a webhook already exists on the channel
		// won't almost ever happen, but just in case, could save an api call
		let webhook = selectedChannelsWebhookResult.data.find(
			(w) => w.user?.id === envs.DC_CLIENT_ID
		);

		if (!webhook) {
			if (selectedChannelsWebhookResult.data.length >= 10) {
				props.ctx.log("Too many webhooks on channel", {
					selectedChannelId,
					guildId: props.i.guild_id,
					amount: selectedChannelsWebhookResult.data.length,
				});

				await editInteractionResponse(props.ctx, props.i, {
					flags: MessageFlags.Ephemeral,
					embeds: [maxNumOfWebhooks(props.language)],
				});

				return;
			}

			const newWebhookResult = await discordApi<RESTPostAPIChannelWebhookResult>(props.ctx, {
				method: "POST",
				path: `/channels/${selectedChannelId}/webhooks`,
				body: {
					name: constants.webhookName,
					avatar: constants.base64Logo,
				},
			});

			if (newWebhookResult.error) {
				props.ctx.log("Failed to create a new webhook", {
					selectedChannelId,
					guildId: props.i.guild_id,
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
			props.ctx.log("Created webhook doesn't have a token", {
				guildId: props.i.guild_id,
				selectedChannelId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});
		}

		const updatedDbServerRes = await props.ctx.mongo.discordServers.findOneAndUpdate(
			{ discordId: props.dbServer.discordId },
			{
				$set: {
					channelId: selectedChannelId,
					webhookId: webhook.id,
					webhookToken: webhook.token,
				},
			},
			{ returnDocument: "after" }
		);

		if (!updatedDbServerRes.ok) {
			props.ctx.log("Failed to update db server", {
				guildId: props.i.guild_id,
				selectedChannelId,
				error: updatedDbServerRes.lastErrorObject,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});

			return;
		}

		if (!updatedDbServerRes.value) {
			props.ctx.log("Failed to update db server, value falsy", {
				guildId: props.i.guild_id,
				selectedChannelId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});

			return;
		}

		const updatedDbServer = updatedDbServerRes.value;

		if (!updatedDbServer.channelId) {
			props.ctx.log("Channel id is falsy after update", {
				guildId: props.i.guild_id,
				selectedChannelId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});

			return;
		}

		editInteractionResponse(props.ctx, props.i, {
			flags: MessageFlags.Ephemeral,
			embeds: [
				channelSetEmbed(props.language, updatedDbServer.channelId),
				settingsEmbed(updatedDbServer, props.language, props.currency),
			],
		});
	} catch (e) {
		props.ctx.log("Failed to set channel - catched an error", {
			error: e,
			guildId: props.i.guild_id,
		});
	}
};
