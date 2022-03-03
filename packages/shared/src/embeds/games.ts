import { IGame } from "../data/types/Game";
import { Languages, translate } from "../localisation";
import { MessageEmbed } from "discord.js";
import { utils } from "./utils";

export const games = (games: IGame[], language: Languages, showId: boolean = false) => {
  const now = Date.now() / 1000;

  let embeds: MessageEmbed[] = [];

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
        translate(`openIn.${language}`) + "\n" +
        utils.redirectToBrowser(game.slug) +
        " • " +
        utils.redirectToLauncher(game.slug) +

        "\n\n" +

        (start > now ? `🟢 ${utils.relativeTimestamp(start)}` + "\n\n" : "") + // only show start if it's in the future
        `🏁 ${utils.relativeTimestamp(end)}` +

        "\n\n" +

        `💰 ${utils.bold(`${utils.strike(game.price)} -> ${translate(`free.${language}`)}`)}!` +

        "\n\n" +

        (showId ? `🆔 ${game._id}` : "") +

        utils.footer(language),
    });

    embeds.push(embed);
  }

  return embeds;
};

export const noFreeGames = (language: Languages) =>
  new MessageEmbed({
    title: translate(`noFreeGames.${language}`),
    color: "DARK_RED",
    description: ":(" + utils.footer(language),
  });

export const noUpcomingGames = (language: Languages) =>
  new MessageEmbed({
    title: translate(`noUpGames.${language}`),
    color: "DARK_RED",
    description: ":(" + utils.footer(language),
  });
