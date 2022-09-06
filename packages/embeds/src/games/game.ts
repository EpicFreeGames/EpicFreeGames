import { botConstants } from "@efg/configuration";
import { t } from "@efg/i18n";
import { ICurrency, IEmbed, IGame, ILanguage } from "@efg/types";

import { embedUtils } from "../_utils";

export default (game: IGame, language: ILanguage, currency: ICurrency): IEmbed => {
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
        "Epicgames.com",
        botConstants.browserRedirect(game.path)
      ) +
      embedUtils.chars.separator +
      embedUtils.link(
        "Epic Launcher",
        botConstants.launcherRedirect(game.path)
      ) +

      "\n\n" +
      
      (start > now ? `🟢 ${embedUtils.relativeTimestamp(start)}` + "\n\n" : "") + // only show start if it's in the future
      `🔴 ${embedUtils.relativeTimestamp(end)}` +

      "\n\n" +

      `💰 ${embedUtils.bold(`${embedUtils.strike(getGamePrice(game, currency))} ${embedUtils.chars.arrow} ${t({language,key: "free"})}`)}!` +


      embedUtils.footer(language),
  };
};

const getGamePrice = (game: IGame, currency: ICurrency): string => {
  const price = game.prices.find((p) => p.currencyCode === currency.code);

  if (!price || !price.formattedValue)
    return game.prices.find((p) => p.currencyCode === "USD")?.formattedValue || "???";

  return price.formattedValue;
};
