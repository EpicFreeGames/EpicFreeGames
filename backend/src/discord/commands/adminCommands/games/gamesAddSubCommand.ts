import { Ctx } from "../../../../ctx";
import { DbGame, DbDiscordServer } from "../../../../db/types";
import {
	editInteractionResponse,
	getTypedOption,
	respondToInteraction,
} from "../../../discordUtils";
import { gameEmbed } from "../../../embeds/gameEmbed";
import { Currency } from "../../../i18n/currency";
import { Language } from "../../../i18n/language";
import {
	APIChatInputApplicationCommandGuildInteraction,
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { z } from "zod";

const gamesAddSchema = z.object({
	name: z.string(),
	imageUrl: z.string().url(),
	path: z.string(),
	startEpochMs: z.number(),
	endEpochMs: z.number(),
	usdPrice: z.number(),
});

export async function gamesAddSubCommand(
	ctx: Ctx,
	i: APIChatInputApplicationCommandGuildInteraction,
	/**
	 * Full command name (e.g. `/set channel`)
	 */
	commandName: string,
	language: Language,
	currency: Currency,
	server: DbDiscordServer | null
) {
	await respondToInteraction(i, {
		type: InteractionResponseType.DeferredChannelMessageWithSource,
		data: { flags: MessageFlags.Ephemeral },
	});

	const name = getTypedOption(i, ApplicationCommandOptionType.String, "name")?.value;
	const imageUrl = getTypedOption(i, ApplicationCommandOptionType.String, "image-url")?.value;
	const path = getTypedOption(i, ApplicationCommandOptionType.String, "path")?.value;
	// prettier-ignore
	const startEpochMs = getTypedOption(i, ApplicationCommandOptionType.Integer, "start-epoch")?.value;
	const endEpochMs = getTypedOption(i, ApplicationCommandOptionType.Integer, "end-epoch")?.value;
	const usdPrice = getTypedOption(i, ApplicationCommandOptionType.Number, "usd-price")?.value;

	console.log({
		name,
		imageUrl,
		path,
		startEpochMs,
		endEpochMs,
		usdPrice,
	});

	const res = await gamesAddSchema.safeParseAsync({
		name,
		imageUrl,
		path,
		startEpochMs,
		endEpochMs,
		usdPrice,
	});

	if (!res.success) {
		await editInteractionResponse(ctx, i, {
			content: `Error:\n\`\`\`${JSON.stringify(res.error.flatten())}\`\`\``,
		});
	} else {
		const startDate = new Date(Number(res.data.startEpochMs));
		const endDate = new Date(Number(res.data.endEpochMs));

		const game: DbGame = {
			name: res.data.name,
			displayName: res.data.name,
			imageUrl: res.data.imageUrl,
			path: res.data.path,
			startDate,
			endDate,
			confirmed: false,
			prices: [
				{
					currencyCode: "USD",
					formattedValue: `$${res.data.usdPrice}`,
					value: res.data.usdPrice,
				},
			],
		};

		const mongoResult = await ctx.db.games.insertOne(game);

		await editInteractionResponse(ctx, i, {
			content: "Game added!",
			embeds: [gameEmbed({ ...game, _id: mongoResult.insertedId }, language, currency, true)],
		});
	}
}
