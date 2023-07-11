import { InteractionResponseType } from "discord-api-types/v10";
import { helpEmbed } from "../embeds/help";
import { Command } from "./_commandType";

export const helpCommand: Command = {
	name: "help",
	needsGuild: false,
	needsManageGuild: false,
	handle: async (props) => {
		props.ctx.respondWith(200, {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { embeds: [helpEmbed(props.language)] },
		});
	},
};
