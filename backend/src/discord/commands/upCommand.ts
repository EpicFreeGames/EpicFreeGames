import { InteractionResponseType } from "discord-api-types/v10";
import { gameEmbed, noUpcomingFreeGamesEmbed } from "../embeds/gameEmbed";
import { Command } from "./_commandType";

export const upCommand: Command = {
	name: "up",
	needsGuild: false,
	needsManageGuild: false,
	handle: async (props) => {
		try {
			const now = new Date();

			const games = await props.ctx.db.game.findMany({
				where: {
					confirmed: true,
					startDate: { gte: now },
					endDate: { gte: now },
				},
				include: { prices: true },
			});

			return props.ctx.respondWith(200, {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					embeds: games.length
						? games.map((g) => gameEmbed(g, props.language, props.currency))
						: [noUpcomingFreeGamesEmbed(props.language)],
				},
			});
		} catch (e) {
			props.ctx.log("Catched an error in /up", { e });
		}
	},
};
