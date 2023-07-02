import { InteractionResponseType } from "discord-api-types/v10";
import { Command } from "./_commandType";
import { gameEmbed, noFreeGamesEmbed } from "../embeds/gameEmbed";
import { genericErrorEmbed } from "../embeds/errors";

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
			props.ctx.log("Error in freeCommand", { e });

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
