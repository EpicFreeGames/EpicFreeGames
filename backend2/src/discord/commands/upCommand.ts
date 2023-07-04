import { InteractionResponseType } from "discord-api-types/v10";
import { genericErrorEmbed } from "../embeds/errors";
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
					start_date: { gte: now },
					end_date: { gte: now },
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
			props.ctx.log("Error in upCommand", { e });

			return props.ctx.respondWith(200, {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					embeds: [
						genericErrorEmbed({
							language: props.language,
							requestId: props.ctx.requestId,
						}),
					],
				},
			});
		}
	},
};
