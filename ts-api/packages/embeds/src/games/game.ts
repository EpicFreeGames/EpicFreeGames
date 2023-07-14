import { t } from "@efg/i18n";
import { ICurrency, IEmbed, IGame, IGameWithStuff, ILanguage } from "@efg/types";

import { embedUtils } from "../_utils";

const getGamePrice = (game: IGame, currency: ICurrency): string => {
  const price = game.prices.find((p) => p.currencyCode === currency.code);

  if (!price || !price.formattedValue)
    return game.prices.find((p) => p.currencyCode === "USD")?.formattedValue || "???";

  return price.formattedValue;
};

const gamePriceString = (
  game: IGameWithStuff,
  language: ILanguage,
  currency: ICurrency
): string => {
  // prettier-ignore
  return `💰 ${embedUtils.bold(`${embedUtils.strike(getGamePrice(game, currency))} ${embedUtils.chars.arrow} ${t({language,key: "free"})}!`)}` + "\n\n";
};

const linkToApp = (game: IGameWithStuff): string => {
  if (!game.redirectAppUrl || !game.store.appLinkName) return "";

  return embedUtils.link(game.store.appLinkName, game.redirectAppUrl);
};

const linkToWeb = (game: IGameWithStuff): string => {
  if (!game.redirectWebUrl || !game.store.webLinkName) return "";

  return embedUtils.link(game.store.webLinkName, game.redirectWebUrl);
};

const links = (game: IGameWithStuff, language: ILanguage): string => {
  const webLink = linkToWeb(game);
  const appLink = linkToApp(game);

  const showSeparator = !!webLink.length;

  return (
    embedUtils.bold(t({ language, key: "open_in" })) +
    "\n" +
    webLink +
    (showSeparator && embedUtils.chars.separator) +
    appLink +
    "\n\n"
  );
};

const gameStart = (game: IGameWithStuff, language: ILanguage): string => {
  const now = Date.now() / 1000;
  const start = new Date(game.start).getTime() / 1000;

  if (start < now) return "";

  return `🟢 ${embedUtils.relativeTimestamp(start)}` + "\n\n";
};

const gameEnd = (game: IGameWithStuff, language: ILanguage): string => {
  const end = new Date(game.end).getTime() / 1000;

  return `🔴 ${embedUtils.relativeTimestamp(end)}` + "\n\n";
};

export default (game: IGameWithStuff, language: ILanguage, currency: ICurrency): IEmbed => {
  return {
    title: game.displayName,
    color: embedUtils.colors.gray,
    image: {
      url: game.imageUrl,
    },
    description:
      links(game, language) +
      gameStart(game, language) +
      gameEnd(game, language) +
      gamePriceString(game, language, currency) +
      embedUtils.footer(language),
  };
};
