import { Ctx } from "../../../../ctx";
import { DbGame } from "../../../../db/types";
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
	APIChatInputApplicationCommandGuildInteraction,
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { ObjectId } from "mongodb";

export async function gamesEditSubCommand(
	ctx: Ctx,
	i: APIChatInputApplicationCommandGuildInteraction
) {
	const gameId = getTypedOption(i, ApplicationCommandOptionType.String, "game-id")?.value;

	if (!gameId) {
		return createInteractionResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: "No game ID",
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
		await editInteractionResponse(i, {
			content: "Game not found",
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

	const name = getTypedOption(i, ApplicationCommandOptionType.String, "name")?.value;
	const imageUrl = getTypedOption(i, ApplicationCommandOptionType.String, "image-url")?.value;
	const path = getTypedOption(i, ApplicationCommandOptionType.String, "path")?.value;
	// prettier-ignore
	const startEpochMs = getTypedOption(i, ApplicationCommandOptionType.String, "start-epoch")?.value;
	const endEpochMs = getTypedOption(i, ApplicationCommandOptionType.String, "end-epoch")?.value;
	const usdPrice = getTypedOption(i, ApplicationCommandOptionType.String, "usd-price")?.value;
	const confirmed = getTypedOption(i, ApplicationCommandOptionType.Boolean, "confirmed")?.value;

	const newGame: DbGame = {
		name: name ?? game.name,
		imageUrl: imageUrl ?? game.imageUrl,
		path: path ?? game.path,
		startDate: startEpochMs ? new Date(parseInt(startEpochMs)) : game.startDate,
		endDate: endEpochMs ? new Date(parseInt(endEpochMs)) : game.endDate,
		confirmed: confirmed ?? game.confirmed,
		displayName: game.displayName,
		prices: game.prices,
	};

	if (usdPrice) {
		const i = newGame.prices.findIndex((price) => price.currencyCode === defaultCurrency.code);

		const val = parseFloat(usdPrice);

		if (i === -1) {
			newGame.prices.push({
				currencyCode: defaultCurrency.code,
				formattedValue: `${defaultCurrency.before}${val}${defaultCurrency.after}`,
				value: val,
			});
		} else {
			newGame.prices[i] = {
				currencyCode: defaultCurrency.code,
				formattedValue: `${defaultCurrency.before}${val}${defaultCurrency.after}`,
				value: val,
			};
		}
	}

	await ctx.db.games.updateOne({ _id: game._id }, { $set: newGame });

	await editInteractionResponse(i, {
		content: "Game updated",
		flags: MessageFlags.Ephemeral,
		embeds: [gameEmbed({ _id: game._id, ...newGame }, defaultLangauge, defaultCurrency, true)],
	});
}
