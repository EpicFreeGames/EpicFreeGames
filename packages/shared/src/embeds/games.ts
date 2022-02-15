import { IGame } from "../data/types";
import { Languages } from "../localisation/languages";
import { MessageEmbed } from "discord.js";
import { translate } from "../localisation";
import { utils } from "./utils";

export const games = (games: IGame[], language: Languages) => {
  const now = Date.now() / 1000;

  let embeds: MessageEmbed[] = [];

  for (const game of games) {
    const start = Math.floor(game.start / 1000);
    const end = Math.floor(game.end / 1000);

    // prettier-ignore
    const embed = new MessageEmbed({
      title: utils.truncate(game.name, 27),
      color: "#2f3136",
      image: {
        url: game.imgUrl,
      },
      description:
        translate("game_link", language) + "\n" +
        utils.redirectToBrowser(language, game.slug) +
        " • " +
        utils.redirectToLauncher(language, game.slug) +

        "\n\n" +

        (start > now ? `🟢 ${utils.relativeTimestamp(start)}` + "\n\n" : "") + // only show start if it's relevant
        `🏁 ${utils.relativeTimestamp(end)}` +

        "\n\n" +

        `💰 **${utils.strike(game.price)} -> ${translate("game_free", language)}!**` +

        "\n\n" +
        utils.footer(language),
    });

    embeds.push(embed);
  }

  return embeds;
};

export const noFreeGames = (language: Languages) =>
  new MessageEmbed({
    title: translate("no_free_game_message", language),
    color: "DARK_RED",
    description: ":(" + utils.footer(language),
  });

export const noUpcomingGames = (language: Languages) =>
  new MessageEmbed({
    title: translate("no_upcoming_game_message", language),
    color: "DARK_RED",
    description: ":(" + utils.footer(language),
  });
