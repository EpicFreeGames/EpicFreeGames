import { env } from "../../../configuration/env";
import { createInteractionResponse } from "../../discordUtils";
import { botAdminOnlyCommandError } from "../../embeds/errors";
import { Command } from "../commandHandler";
import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";

export const sendCommand: Command = {
	requiresGuild: true,
	handler: async (ctx, i, commandName, language) => {
		if (i.member.user.id !== env.DC_ADMIN_ID) {
			return createInteractionResponse({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					embeds: [botAdminOnlyCommandError(language)],
					flags: MessageFlags.Ephemeral,
				},
			});
		}
	},
};
