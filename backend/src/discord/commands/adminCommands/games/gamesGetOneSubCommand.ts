import { Ctx } from "../../../../ctx";
import {
	createInteractionResponse,
	editInteractionResponse,
	getTypedOption,
	respondToInteraction,
} from "../../../discordUtils";
import { gameEmbed } from "../../../embeds/gameEmbed";
import { defaultCurrency } from "../../../i18n/currency";
import { defaultLangauge } from "../../../i18n/language";
import {
	APIChatInputApplicationCommandInteraction,
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { ObjectId } from "mongodb";

export async function gamesGetOneSubCommand(
	ctx: Ctx,
	i: APIChatInputApplicationCommandInteraction
) {
	const gameId = getTypedOption(i, ApplicationCommandOptionType.String, "game-id")?.value as
		| string
		| undefined;

	if (!gameId) {
		return createInteractionResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: "Invalid game id",
				flags: MessageFlags.Ephemeral,
			},
		});
	}

	await respondToInteraction(i, {
		type: InteractionResponseType.DeferredChannelMessageWithSource,
		data: { flags: MessageFlags.Ephemeral },
	});

	const game = await ctx.db.games.findOne({ _id: new ObjectId(gameId) });

	if (!game) {
		await editInteractionResponse(ctx, i, {
			content: "Game not found",
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

	await editInteractionResponse(ctx, i, {
		embeds: [gameEmbed(game, defaultLangauge, defaultCurrency, true)],
	});
}
