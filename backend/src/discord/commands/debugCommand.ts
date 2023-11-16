import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { debugEmbed } from "../embeds/debug";
import { Command } from "./_commandType";

export const debugCommand: Command = {
	name: "debug",
	needsGuild: true,
	needsManageGuild: false,
	handle: async (props) => {
		try {
			return props.ctx.respondWith(200, {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					flags: MessageFlags.Ephemeral,
					embeds: [debugEmbed(props.i.guild_id)],
				},
			});
		} catch (e) {
			props.ctx.log("Catched an error in /debug", { e });
		}
	},
};
