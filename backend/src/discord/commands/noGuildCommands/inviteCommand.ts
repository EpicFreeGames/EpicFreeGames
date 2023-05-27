import { createInteractionResponse } from "../../discordUtils";
import { inviteEmbed } from "../../embeds/invite";
import { Command } from "../commandHandler";
import { InteractionResponseType } from "discord-api-types/v10";

export const inviteCommand = {
	requiresGuild: false,
	handler: async (ctx, i, language, currency) => {
		return createInteractionResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { embeds: [inviteEmbed(language)] },
		});
	},
} satisfies Command;
