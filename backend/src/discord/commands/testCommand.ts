import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { discordApi } from "../discordApi";
import { displayRole, editInteractionResponse } from "../utils";
import { Command } from "./_commandType";
import { channelNotSetEmbed } from "../embeds/errors";

export const testCommand: Command = {
	name: "test",
	needsGuild: true,
	needsManageGuild: true,
	handle: async (props) => {
		if (!props.dbServer.channelId) {
			props.ctx.respondWith(200, {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					flags: MessageFlags.Ephemeral,
					embeds: [channelNotSetEmbed(props.language)],
				},
			});

			return;
		}

		props.ctx.respondWith(200, {
			type: InteractionResponseType.DeferredChannelMessageWithSource,
			data: { flags: MessageFlags.Ephemeral },
		});

		const searchParams = new URLSearchParams();
		if (props.dbServer.threadId) {
			searchParams.append("thread_id", props.dbServer.threadId);
		}

		const path =
			`/webhooks/${props.dbServer.webhookId}/${props.dbServer.webhookToken}` +
			(searchParams.size ? `?${searchParams.toString()}` : "");

		await discordApi(props.ctx, {
			method: "POST",
			path,
			body: {
				...(props.dbServer.roleId ? { content: displayRole(props.dbServer.roleId) } : {}),
				embeds: [{ title: "Testing", description: "Testing testing..." }],
			},
		});

		await editInteractionResponse(props.ctx, props.i, {
			content: "✅",
			flags: MessageFlags.Ephemeral,
		});
	},
};
