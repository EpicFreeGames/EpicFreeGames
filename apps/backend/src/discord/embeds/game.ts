import type { APIEmbed } from "discord-api-types/v10";

import type { DbGame } from "@efg/db";

import { constants } from "../../configuration/constants";
import type { Currency } from "../i18n/currency";
import type { Language } from "../i18n/language";
import { t } from "../i18n/translate";
import { embedUtils } from "./_utils";

export function gameEmbed(game: DbGame, language: Language, currency: Currency) {
	return {
		title: game.displayName,
		color: embedUtils.colors.gray,
		image: { url: game.imageUrl },
		description:
			links(game, language) +
			gameStart(game) +
			gameEnd(game) +
			gamePriceString(game, language, currency) +
			embedUtils.footer(language),
	} satisfies APIEmbed;
}

function links(game: DbGame, language: Language) {
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

function gameLinks(game: DbGame) {
	return {
		redirectWeb: constants.links.frontHome + "/r/web/" + game.path,
		redirectApp: constants.links.frontHome + "/r/app/" + game.path,
	};
}

function gameStart(game: DbGame): string {
	const now = Date.now() / 1000;
	const start = new Date(game.startDate).getTime() / 1000;

	if (start < now) return "";

	return `🟢 ${embedUtils.relativeTimestamp(start)}` + "\n\n";
}

function gameEnd(game: DbGame): string {
	const end = new Date(game.endDate).getTime() / 1000;

	return `🔴 ${embedUtils.relativeTimestamp(end)}` + "\n\n";
}

function gamePriceString(game: DbGame, language: Language, currency: Currency): string {
	// prettier-ignore
	return `💰 ${embedUtils.bold(`${embedUtils.strike(getGamePrice(game, currency))} ${embedUtils.chars.arrow} ${t(language, "free")}!`)}` + "\n\n";
}

function getGamePrice(game: DbGame, currency: Currency): string {
	const price = game.prices.find((p) => p.currencyCode === currency.code);

	if (!price || !price.formattedValue)
		return game.prices.find((p) => p.currencyCode === "USD")?.formattedValue || "???";

	return price.formattedValue;
}

export function noFreeGamesEmbed(language: Language) {
	return {
		title: t(language, "no_free_games"),
		color: embedUtils.colors.red,
	} satisfies APIEmbed;
}

export function noUpcomingFreeGamesEmbed(language: Language) {
	return {
		title: t(language, "no_upcoming_free_games"),
		color: embedUtils.colors.red,
	} satisfies APIEmbed;
}
