import { createInteractionResponse } from "../../discordUtils";
import { genericErrorEmbed } from "../../embeds/errors";
import { gameEmbed, noUpcomingFreeGamesEmbed } from "../../embeds/gameEmbed";
import { Command } from "../commandHandler";
import { InteractionResponseType } from "discord-api-types/v10";

export const upCommand: Command = {
	requiresGuild: false,
	handler: async (ctx, i, commandName, language, currency) => {
		try {
			const now = new Date();

			const upcomingFreeGames = await ctx.db.games
				.find({
					startDate: { $gte: now },
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
		} catch (e) {
			ctx.log("Error", { e });

			return createInteractionResponse({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: { embeds: [genericErrorEmbed({ language, requestId: ctx.requestId })] },
			});
		}
	},
};
