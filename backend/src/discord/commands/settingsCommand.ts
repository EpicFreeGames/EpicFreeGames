import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { settingsEmbed } from "../embeds/settings";
import { Command } from "./_commandType";

export const settingsCommand: Command = {
	name: "settings",
	needsGuild: true,
	needsManageGuild: true,
	handle: async (props) => {
		props.ctx.respondWith(200, {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				flags: MessageFlags.Ephemeral,
				embeds: [settingsEmbed(props.dbServer, props.language, props.currency)],
			},
		});
	},
};
