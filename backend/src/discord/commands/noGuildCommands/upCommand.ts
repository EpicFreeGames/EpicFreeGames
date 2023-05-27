import { createInteractionResponse } from "../../discordUtils";
import { genericErrorEmbed } from "../../embeds/errors";
import { gameEmbed, noUpcomingFreeGamesEmbed } from "../../embeds/game";
import { Command } from "../commandHandler";
import { InteractionResponseType } from "discord-api-types/v10";

export const upCommand: Command = {
	requiresGuild: false,
	handler: async (ctx, i, language, currency) => {
		try {
			const now = new Date();

			const upcomingFreeGames = await ctx.db.games
				.find({
					startDate: { $lte: now },
					endDate: { $gte: now },
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
		} catch (e) {
			ctx.log("Error", { e });

			return createInteractionResponse({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: { embeds: [genericErrorEmbed({ language, requestId: ctx.requestId })] },
			});
		}
	},
};
