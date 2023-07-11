import { game, game_price } from "@prisma/client";
import { constants } from "../../configuration/constants";
import { Currency } from "../i18n/currency";
import { Language } from "../i18n/language";
import { t } from "../i18n/translate";
import { embedUtils } from "./_utils";
import { APIEmbed } from "discord-api-types/v10";

export function noFreeGamesEmbed(language: Language) {
	return {
		title: t(language, "no_free_games"),
		description: ":(",
		color: embedUtils.colors.red,
	} satisfies APIEmbed;
}

export function noUpcomingFreeGamesEmbed(language: Language) {
	return {
		title: t(language, "no_upcoming_games"),
		description: ":(",
		color: embedUtils.colors.red,
	} satisfies APIEmbed;
}

export function gameEmbed(
	game: game & { prices: game_price[] },
	language: Language,
	currency: Currency
) {
	return {
		title: game.display_name,
		color: embedUtils.colors.gray,
		image: { url: game.image_url },
		description:
			links(game, language) +
			gameStart(game) +
			gameEnd(game) +
			gamePriceString(game, language, currency),
	} satisfies APIEmbed;
}

function links(game: game & { prices: game_price[] }, language: Language) {
	const gameLink = gameLinks(game);

	return (
		embedUtils.bold(t(language, "open_in")) +
		"\n" +
		embedUtils.link("Epicgames.com", gameLink.redirectWeb) +
		embedUtils.chars.separator +
		embedUtils.link("Epic Launcher", gameLink.redirectApp) +
		"\n\n"
	);
}

function gameLinks(game: game & { prices: game_price[] }) {
	return {
		redirectWeb: constants.links.frontHome + "/r/web/" + game.path,
		redirectApp: constants.links.frontHome + "/r/app/" + game.path,
	};
}

function gameStart(game: game & { prices: game_price[] }): string {
	const now = Date.now() / 1000;
	const start = new Date(game.start_date).getTime() / 1000;

	if (start < now) return "";

	return `🟢 ${embedUtils.relativeTimestamp(start)}` + "\n\n";
}

function gameEnd(game: game & { prices: game_price[] }): string {
	const end = new Date(game.end_date).getTime() / 1000;

	return `🔴 ${embedUtils.relativeTimestamp(end)}` + "\n\n";
}

function gamePriceString(
	game: game & { prices: game_price[] },
	language: Language,
	currency: Currency
): string {
	// prettier-ignore
	return `💰 ${embedUtils.bold(`${embedUtils.strike(getGamePrice(game, currency))} ${embedUtils.chars.arrow} ${t(language, "free")}!`)}` + "\n\n";
}

function getGamePrice(game: game & { prices: game_price[] }, currency: Currency): string {
	const price = game.prices.find((p) => p.currency_code === currency.code);

	if (!price || !price.formatted_value)
		return game.prices.find((p) => p.currency_code === "USD")?.formatted_value || "???";

	return price.formatted_value;
}
