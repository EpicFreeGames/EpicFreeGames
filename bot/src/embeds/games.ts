import { Embed } from "discordeno";
import { config } from "../config.ts";
import { t } from "../i18n/translate.ts";
import { Currency, Game, Language } from "../types.ts";
import { getGamePrice } from "../utils/getGamePrice.ts";
import { colors, utils } from "./embedUtils.ts";

export const gameEmbed = (game: Game, language: Language, currency: Currency): Embed => {
  const now = Date.now() / 1000;
  const start = new Date(game.start).getTime() / 1000;
  const end = new Date(game.end).getTime() / 1000;

  return {
    title: game.displayName,
    color: colors.gray,
    image: {
      url: game.imageUrl,
    },
    // prettier-ignore
    description:
      t({language, key: "open_in"}) +

      "\n" +
      
      utils.link(
        "Epicgames.com",
        `${config.LINKS_BROWSER_REDIRECT}${game.path}`
      ) +
      " • " +
      utils.link(
        "Epic Launcher",
        `${config.LINKS_LAUNCHER_REDIRECT}${game.path}`
      ) +

      "\n\n" +
      
      (start > now ? `🟢 ${utils.relativeTimestamp(start)}` + "\n\n" : "") + // only show start if it's in the future
      `🏁 ${utils.relativeTimestamp(end)}` +

      "\n\n" +

      `💰 ${utils.bold(`${utils.strike(getGamePrice(game, currency))} -> ${t({language,key: "free"})}`)}!` +

      "\n\n" +

      utils.footer(language),
  };
};

export const noFreeGames = (language: Language): Embed => ({
  title: t({ language, key: "no_free_games" }),
  color: colors.red,
  description: ":(" + utils.footer(language),
});

export const noUpcomingGames = (language: Language): Embed => ({
  title: t({ language, key: "no_upcoming_games" }),
  color: colors.red,
  description: ":(" + utils.footer(language),
});
