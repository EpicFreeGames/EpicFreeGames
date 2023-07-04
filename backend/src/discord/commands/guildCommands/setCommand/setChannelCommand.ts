import { constants } from "../../../../configuration/constants";
import { env } from "../../../../configuration/env";
import { Ctx } from "../../../../ctx";
import { DbServer } from "../../../../db/types";
import { discordApiRequest } from "../../../discordApiRequest";
import { PermissionString, hasPermsOnChannel } from "../../../discordPerms";
import {
	getTypedOption,
	editInteractionResponse,
	respondToInteraction,
} from "../../../discordUtils";
import { genericErrorEmbed } from "../../../embeds/errors";
import { missingPermsEmbed, maxNumOfWebhooks, channelSetEmbed } from "../../../embeds/setChannel";
import { settingsEmbed } from "../../../embeds/settings";
import { Currency } from "../../../i18n/currency";
import { Language } from "../../../i18n/language";
import {
	MessageFlags,
	ApplicationCommandOptionType,
	RESTGetAPIChannelWebhooksResult,
	RESTPostAPIChannelWebhookResult,
	APIChatInputApplicationCommandGuildInteraction,
	InteractionResponseType,
} from "discord-api-types/v10";

export async function setChannelSubCommand(
	ctx: Ctx,
	i: APIChatInputApplicationCommandGuildInteraction,
	commandName: string,
	language: Language,
	currency: Currency,
	dbServer: DbServer | null
) {
	await respondToInteraction(ctx, i, {
		type: InteractionResponseType.DeferredChannelMessageWithSource,
		data: { flags: MessageFlags.Ephemeral },
	});

	try {
		const channelIdOption = getTypedOption(i, ApplicationCommandOptionType.Channel, "channel");
		if (!channelIdOption) return;

		const selectedChannelId = channelIdOption.value;
		const selectedChannelIdBigInt = BigInt(selectedChannelId);

		const neededPerms: PermissionString[] = ["VIEW_CHANNEL", "MANAGE_WEBHOOKS", "EMBED_LINKS"];
		if (dbServer?.roleId) neededPerms.push("MENTION_EVERYONE" as const);
		const permsResult = await hasPermsOnChannel(
			ctx,
			i.guild_id,
			selectedChannelIdBigInt,
			neededPerms
		);

		if (permsResult.error) {
			ctx.log("Failed to check perms on channel", {
				error: permsResult.error,
				selectedChannelId,
			});

			await editInteractionResponse(ctx, i, {
				embeds: [genericErrorEmbed({ language, requestId: ctx.requestId })],
			});

			return;
		}

		if (permsResult.hasPerms === false) {
			await editInteractionResponse(ctx, i, {
				embeds: [missingPermsEmbed(selectedChannelIdBigInt, language, permsResult.details)],
			});

			return;
		}

		const selectedChannelsWebhookResult =
			await discordApiRequest<RESTGetAPIChannelWebhooksResult>({
				ctx,
				method: "GET",
				path: `/channels/${selectedChannelId}/webhooks`,
			});

		if (selectedChannelsWebhookResult.error) {
			ctx.log("Failed to get webhooks for channel", {
				error: selectedChannelsWebhookResult.error,
				selectedChannelId,
			});

			await editInteractionResponse(ctx, i, {
				embeds: [genericErrorEmbed({ language, requestId: ctx.requestId })],
			});

			return;
		}

		// delete the previous saved webhook if new channel !== old channel
		// that cannot be used since the channel is changing
		if (
			dbServer?.webhookId &&
			dbServer.webhookToken &&
			dbServer.channelId !== selectedChannelId
		) {
			await discordApiRequest({
				ctx,
				method: "DELETE",
				path: `/webhooks/${dbServer.webhookId}/${dbServer.webhookToken}`,
			});
		}

		// check if a webhook already exists on the channel
		// won't almost ever happen, but just in case
		let webhook = selectedChannelsWebhookResult.data.find(
			(w) => w.user?.id === env.DC_CLIENT_ID
		);

		if (!webhook) {
			if (selectedChannelsWebhookResult.data.length >= 10) {
				ctx.log("Too many webhooks on channel", {
					selectedChannelId,
					amount: selectedChannelsWebhookResult.data.length,
				});

				await editInteractionResponse(ctx, i, {
					embeds: [maxNumOfWebhooks(language)],
					flags: MessageFlags.Ephemeral,
				});

				return;
			}

			const newWebhookResult = await discordApiRequest<RESTPostAPIChannelWebhookResult>({
				ctx,
				method: "POST",
				path: `/channels/${selectedChannelId}/webhooks`,
				body: {
					name: constants.webhookName,
					avatar: constants.base64Logo,
				},
			});

			if (newWebhookResult.error) {
				ctx.log("Failed to create a new webhook", {
					error: newWebhookResult.error,
					selectedChannelId,
				});

				await editInteractionResponse(ctx, i, {
					embeds: [genericErrorEmbed({ language, requestId: ctx.requestId })],
				});

				return;
			}

			webhook = newWebhookResult.data;
		}

		if (!webhook.token) {
			ctx.log("Created webhook doesn't have a token", {
				selectedChannelId,
			});

			await editInteractionResponse(ctx, i, {
				embeds: [genericErrorEmbed({ language, requestId: ctx.requestId })],
				flags: MessageFlags.Ephemeral,
			});
		}

		const updatedDbServer = await ctx.db.servers.findOneAndUpdate(
			{ id: i.guild_id },
			{
				$set: {
					channelId: selectedChannelId,
					webhookId: webhook.id,
					webhookToken: webhook.token,
				},
				$setOnInsert: {
					id: i.guild_id,
					createdAt: new Date(),
					currencyCode: currency.code,
					languageCode: language.code,
					roleId: null,
					threadId: null,
				},
			},
			{ upsert: true, returnDocument: "after" }
		);

		if (!updatedDbServer.value) {
			ctx.log("Mongo returned no value when updating webhook", {
				selectedChannelId,
			});

			await editInteractionResponse(ctx, i, {
				embeds: [genericErrorEmbed({ language, requestId: ctx.requestId })],
				flags: MessageFlags.Ephemeral,
			});

			return;
		}

		await editInteractionResponse(ctx, i, {
			embeds: [
				channelSetEmbed(language, updatedDbServer.value.channelId!),
				settingsEmbed(updatedDbServer.value, language, currency),
			],
			flags: MessageFlags.Ephemeral,
		});
	} catch (err) {
		ctx.log("Catched an error in /set channel", { error: err });

		await editInteractionResponse(ctx, i, {
			embeds: [genericErrorEmbed({ language, requestId: ctx.requestId })],
			flags: MessageFlags.Ephemeral,
		});
	}
}
