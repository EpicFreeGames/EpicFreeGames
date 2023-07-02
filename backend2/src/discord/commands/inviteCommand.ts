import { InteractionResponseType } from "discord-api-types/v10";
import { Command } from "./_commandType";
import { inviteEmbed } from "../embeds/invite";

export const inviteCommand: Command = {
	name: "invite",
	needsGuild: false,
	needsManageGuild: false,
	handle: async (props) => {
		props.ctx.respondWith(200, {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { embeds: [inviteEmbed(props.language)] },
		});
	},
};
