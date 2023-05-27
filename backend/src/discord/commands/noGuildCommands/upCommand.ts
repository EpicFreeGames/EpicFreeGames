import { createInteractionResponse } from "../../discordUtils";
import { gameEmbed, noUpcomingFreeGamesEmbed } from "../../embeds/game";
import type { Command } from "../commandHandler";
import { InteractionResponseType } from "discord-api-types/v10";

export const upCommand = {
	requiresGuild: false,
	handler: async (ctx, i, language, currency) => {
		const now = new Date();

		const upcomingFreeGames = await ctx.db.games
			.find({
				startDate: { $gt: now },
				endDate: { $gt: now },
				confirmed: true,
			})
			.toArray();

		return createInteractionResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				embeds: upcomingFreeGames.length
					? upcomingFreeGames.map((game) => gameEmbed(game, language, currency))
					: [noUpcomingFreeGamesEmbed(language)],
			},
		});
	},
} satisfies Command;
