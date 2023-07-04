import { discord_server } from "@prisma/client";
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

export const setThreadSubCommand = async (props: {
	ctx: DiscordRequestContext;
	i: APIChatInputApplicationCommandGuildInteraction;
	language: Language;
	currency: Currency;
	dbServer: discord_server;
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
				guildId: props.i.guild_id,
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
				guildId: props.i.guild_id,
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
				guildId: props.i.guild_id,
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
				...(props.dbServer?.role_id ? ["MENTION_EVERYONE" as PermissionString] : []), // check only if server has a set role
			]
		);

		if (hasPermsResult.error) {
			props.ctx.log("Failed to set thread - failed to check perms on parent", {
				error: hasPermsResult.error,
				guildId: props.i.guild_id,
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
				guildId: props.i.guild_id,
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
				guildId: props.i.guild_id,
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
			props.dbServer?.webhook_id &&
			props.dbServer.webhook_token &&
			props.dbServer.channel_id !== selectedThreadParentId
		) {
			discordApi(props.ctx, {
				method: "DELETE",
				path: `/webhooks/${props.dbServer.webhook_id}/${props.dbServer.webhook_token}`,
			});
		}

		// check if a webhook already exists on the channel
		// won't almost ever happen, but just in case, could save an api call
		let webhook = parentChannelsWebhooksResult.data.find(
			(w) => w.user?.id === envs.DC_CLIENT_ID
		);

		if (!webhook) {
			if (parentChannelsWebhooksResult.data.length >= 10) {
				props.ctx.log("Too many webhooks on parent", {
					guildId: props.i.guild_id,
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
				props.ctx.log("Failed to create a new webhook on parent", {
					guildId: props.i.guild_id,
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
			props.ctx.log("Created webhook doesn't have a token", {
				guildId: props.i.guild_id,
				selectedThreadParentId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});
		}

		const updatedDbServer = await props.ctx.db.discord_server.update({
			where: { id: props.dbServer.id },
			data: {
				channel_id: selectedThreadParentId,
				thread_id: selectedThreadId,
				webhook_id: webhook.id,
				webhook_token: webhook.token,
			},
		});

		if (!updatedDbServer.channel_id) {
			props.ctx.log("Db server channel id is falsy after update", {
				guildId: props.i.guild_id,
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

		if (!updatedDbServer.thread_id) {
			props.ctx.log("Db server thread id is falsy after update", {
				guildId: props.i.guild_id,
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
				channelSetEmbed(props.language, updatedDbServer.thread_id),
				settingsEmbed(updatedDbServer, props.language, props.currency),
			],
		});
	} catch (e) {
		props.ctx.log("Catched an error in /set thread", {
			error: e,
			guildId: props.i.guild_id,
		});

		await editInteractionResponse(props.ctx, props.i, {
			flags: MessageFlags.Ephemeral,
			embeds: [
				genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
			],
		});
	}
};

function makeSenseOfRole(role: any) {
	if (role.name === "@everyone") return { embed: "@everyone", toDb: "1" };
	return { embed: `<@&${role.id}>`, toDb: role.id };
}
