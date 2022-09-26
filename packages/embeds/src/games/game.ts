import { t } from "@efg/i18n";
import { ICurrency, IEmbed, IGame, IGameWithStuff, ILanguage } from "@efg/types";

import { embedUtils } from "../_utils";

export default (game: IGameWithStuff, language: ILanguage, currency: ICurrency): IEmbed => {
  const now = Date.now() / 1000;
  const start = new Date(game.start).getTime() / 1000;
  const end = new Date(game.end).getTime() / 1000;

  return {
    title: game.displayName,
    color: embedUtils.colors.gray,
    image: {
      url: game.imageUrl,
    },
    // prettier-ignore
    description:
    embedUtils.bold(t({language, key: "open_in"})) +

      "\n" +
      
      embedUtils.link(
        game.store.webLinkName,
        game.redirectWebUrl
      ) + 
      (game.redirectAppUrl && game.store.appLinkName && embedUtils.chars.separator +
        embedUtils.link(
          game.store.appLinkName,
          game.redirectAppUrl
        )) + 

      "\n\n" +
      
      (start > now ? `🟢 ${embedUtils.relativeTimestamp(start)}` + "\n\n" : "") + // only show start if it's in the future
      `🔴 ${embedUtils.relativeTimestamp(end)}` +

      "\n\n" +

      `💰 ${embedUtils.bold(`${embedUtils.strike(getGamePrice(game, currency))} ${embedUtils.chars.arrow} ${t({language,key: "free"})}`!)}` +


      embedUtils.footer(language),
  };
};

const getGamePrice = (game: IGame, currency: ICurrency): string => {
  const price = game.prices.find((p) => p.currencyCode === currency.code);

  if (!price || !price.formattedValue)
    return game.prices.find((p) => p.currencyCode === "USD")?.formattedValue || "???";

  return price.formattedValue;
};
