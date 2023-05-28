import { createInteractionResponse } from "../../discordUtils";
import { genericErrorEmbed } from "../../embeds/errors";
import { gameEmbed, noFreeGamesEmbed } from "../../embeds/gameEmbed";
import { Command } from "../commandHandler";
import { InteractionResponseType } from "discord-api-types/v10";

export const freeCommand = {
	requiresGuild: false,
	handler: async (ctx, i, commandName, language, currency) => {
		try {
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
		} catch (e) {
			ctx.log("Error", { e });

			return createInteractionResponse({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: { embeds: [genericErrorEmbed({ language, requestId: ctx.requestId })] },
			});
		}
	},
} satisfies Command;
