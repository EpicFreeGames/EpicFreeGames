import { APIDMInteraction, APIGuildInteraction } from "discord-api-types/v10";
import { APIInteractionResponse } from "discord-api-types/v10";
import { InteractionResponseType } from "discord-api-types/v10";
import { and, eq, gte, lte } from "drizzle-orm";

import { gameEmbed, noFreeGamesEmbed } from "@/discord/embeds/game";
import { Currency } from "@/discord/i18n/currency";
import { Language } from "@/discord/i18n/language";
import { Game, GamePrice, db, gamePrices, games } from "@efg/db";

export async function freeCommand(
	interaction: APIDMInteraction | APIGuildInteraction,
	language: Language,
	currency: Currency
) {
	const now = new Date();
	const gamesAndPricesRows = await db
		.select()
		.from(games)
		.where(and(gte(games.startDate, now), lte(games.endDate, now)))
		.leftJoin(gamePrices, eq(games.id, gamePrices.gameId));

	const gamesAndPricesObject = gamesAndPricesRows.reduce<{
		[key: string]: { game: Game; gamePrices: GamePrice[] };
	}>(
		(acc, row) => {
			const game = row.games;
			const gamePrice = row.game_prices;

			if (!acc[game.id]) {
				acc[game.id] = {
					game,
					gamePrices: [],
				};
			}

			if (gamePrice) {
				acc[game.id]!.gamePrices.push(gamePrice);
			}

			return acc;
		},
		{} as {
			[key: string]: { game: Game; gamePrices: GamePrice[] };
		}
	);

	const gamesAndPrices = Object.values(gamesAndPricesObject);

	if (!gamesAndPrices.length) {
		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { embeds: [noFreeGamesEmbed(language)] },
		} satisfies APIInteractionResponse;
	}

	return {
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {},
	} satisfies APIInteractionResponse;
}
