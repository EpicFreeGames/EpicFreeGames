import { createInteractionResponse } from "../../discordUtils";
import { helpEmbed } from "../../embeds/help";
import type { Command } from "../commandHandler";
import { InteractionResponseType } from "discord-api-types/v10";

export const helpCommand = {
	requiresGuild: false,
	handler: async (ctx, i, language, currency) => {
		return createInteractionResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { embeds: [helpEmbed(language)] },
		});
	},
} satisfies Command;
