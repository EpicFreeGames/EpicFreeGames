import { createInteractionResponse } from "../../discordUtils";
import { gameEmbed, noFreeGamesEmbed } from "../../embeds/game";
import type { Command } from "../commandHandler";
import { InteractionResponseType } from "discord-api-types/v10";

export const freeCommand = {
	requiresGuild: false,
	handler: async (ctx, i, language, currency) => {
		const now = new Date();

		const freeGames = await ctx.db.games
			.find({
				startDate: { $lte: now },
				endDate: { $gte: now },
				confirmed: true,
			})
			.toArray();

		return createInteractionResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				embeds: freeGames.length
					? freeGames.map((game) => gameEmbed(game, language, currency))
					: [noFreeGamesEmbed(language)],
			},
		});
	},
} satisfies Command;
