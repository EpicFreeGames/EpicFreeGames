import { MessageEmbed } from "discord.js";
import { Languages } from "../localisation/languages";
import { translate } from "../localisation";
import { constants } from "config";
import { utils } from "./utils";

export const help = (language: Languages) =>
  new MessageEmbed({
    title: "Help",
    color: "GREEN",
    description:
      `**${translate("commands_title", language)}**` +
      "\n" +
      translate("help_command_description", language, { link: constants.links.commands }) +
      utils.footer(language),
  }).setThumbnail(constants.photos.thumbnail);

export const vote = (language: Languages) =>
  new MessageEmbed({
    title: translate("vote_title", language),
    color: "BLUE",
    image: {
      url: constants.gifs.vote,
    },
    description: constants.links.vote,
  });

export const invite = (language: Languages) =>
  new MessageEmbed({
    title: translate("invite_title", language),
    color: "BLUE",
    image: {
      url: constants.gifs.invite,
    },
    description: constants.links.botInvite,
  });

export const debug = (guildId: string) =>
  new MessageEmbed({
    title: "Debug info",
    color: "BLUE",
    description: `Guild ID: ${guildId}`,
  });
