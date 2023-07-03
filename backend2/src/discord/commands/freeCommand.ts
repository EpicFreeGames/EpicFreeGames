import { InteractionResponseType } from "discord-api-types/v10";
import { gameEmbed, noFreeGamesEmbed } from "../embeds/gameEmbed";
import { Command } from "./_commandType";

export const freeCommand: Command = {
	name: "free",
	needsGuild: false,
	needsManageGuild: false,
	handle: async (props) => {
		try {
			const now = new Date();

			const games = await props.ctx.mongo.games
				.find({
					startDate: { $lte: now },
					endDate: { $gte: now },
					confirmed: true,
				})
				.toArray();

			return props.ctx.respondWith(200, {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					embeds: games.length
						? games.map((g) => gameEmbed(g, props.language, props.currency))
						: [noFreeGamesEmbed(props.language)],
				},
			});
		} catch (e) {
			props.ctx.log("Error in /free", { e });
		}
	},
};
