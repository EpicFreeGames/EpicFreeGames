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

			const games = await props.ctx.db.game.findMany({
				where: {
					confirmed: true,
					start_date: { lte: now },
					end_date: { gte: now },
				},
				include: { prices: true },
			});

			return props.ctx.respondWith(200, {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					embeds: games.length
						? games.map((g) => gameEmbed(g, props.language, props.currency))
						: [noFreeGamesEmbed(props.language)],
				},
			});
		} catch (e) {
			props.ctx.log("Catched an error in /free", { e });
		}
	},
};
