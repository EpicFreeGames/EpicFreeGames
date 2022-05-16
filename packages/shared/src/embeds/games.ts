import { IGame } from "../data/types/Game";
import { Languages, Currencies, t } from "../localisation";
import { MessageEmbed } from "discord.js";
import { utils } from "./utils";
import { getGamePrice } from "../utils";
import { constants } from "config";

export const games = (
  games: IGame[],
  language: Languages,
  currency: Currencies,
  showId: boolean = false
) => {
  const now = Date.now() / 1000;

  let answerEmbeds: MessageEmbed[] = [];

  for (const game of games) {
    const start = game.start.getTime() / 1000;
    const end = game.end.getTime() / 1000;

    // prettier-ignore
    const embed = new MessageEmbed({
      title: utils.truncate(game.name, 31),
      color: "#2f3136",
      image: {
        url: game.imageUrl,
      },
      description:
        t("open_in", language) + "\n" +
        utils.link("Epicgames.com", `${constants.links.browserRedirect}${game.slug}`) +
        " • " +
        utils.link("Epic Launcher", `${constants.links.launcherRedirect}${game.slug}`) +

        "\n\n" +

        (start > now ? `🟢 ${utils.relativeTimestamp(start)}` + "\n\n" : "") + // only show start if it's in the future
        `🏁 ${utils.relativeTimestamp(end)}` +

        "\n\n" +

        `💰 ${utils.bold(`${utils.strike(getGamePrice(game, currency))} -> ${t("free", language)}`)}!` +

        "\n\n" +

        (showId ? `🆔 ${game._id}\n\n` : "") +
        (showId ? `Confirmed: ${game.confirmed ? "✅" : "❌"}` : "") +

        utils.footer(language),
    });

    answerEmbeds.push(embed);
  }

  return answerEmbeds;
};

export const noFreeGames = (language: Languages) =>
  new MessageEmbed({
    title: t("no_free_games", language),
    color: "DARK_RED",
    description: ":(" + utils.footer(language),
  });

export const noUpcomingGames = (language: Languages) =>
  new MessageEmbed({
    title: t("no_upcoming_games", language),
    color: "DARK_RED",
    description: ":(" + utils.footer(language),
  });
