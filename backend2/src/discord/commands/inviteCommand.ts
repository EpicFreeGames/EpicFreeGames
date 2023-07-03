import { InteractionResponseType } from "discord-api-types/v10";
import { inviteEmbed } from "../embeds/invite";
import { Command } from "./_commandType";

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
