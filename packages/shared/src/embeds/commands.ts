import { MessageEmbed } from "discord.js";
import { CurrencyData, Languages, LanguagesWithFlags, translate } from "../localisation";
import { constants } from "config";
import { utils } from "./utils";
import { IGuild } from "../data/types";

export const help = (language: Languages) =>
  new MessageEmbed({
    title: "Help",
    color: "GREEN",
    description:
      utils.bold(`${translate(`commands.${language}`)}`) +
      "\n" +
      translate(`helpDesc.${language}`, { link: constants.links.commands }) +
      utils.footer(language),
  }).setThumbnail(constants.photos.thumbnail);

export const vote = (language: Languages) =>
  new MessageEmbed({
    title: translate(`voteTitle.${language}`),
    color: "BLUE",
    image: {
      url: constants.gifs.vote,
    },
    description: constants.links.vote,
  });

export const invite = (language: Languages) =>
  new MessageEmbed({
    title: translate(`inviteTitle.${language}`),
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
    description: utils.bold(`Guild ID: ${guildId}`),
  });

// prettier-ignore
export const settings = (guild: IGuild | null,  language: Languages) =>
  new MessageEmbed({
    title: "Settings",
    color: "#2f3136",
    description:
      utils.bold(`Channel: `) + (guild?.channelId ? `<#${guild?.channelId}>` : "Not set, you can set a channel with `/set channel`") +
      "\n\n" +
      utils.bold(`Role: `) + (guild?.roleId ? guild.roleId === "1" ? "@everyone" : `<@&${guild?.roleId}>` : "Not set, you can set a role with `/set role`") +
      "\n\n" +
      utils.bold(`Language: `) + (guild?.language ? `${LanguagesWithFlags[guild.language]}` : LanguagesWithFlags[Languages.en]) +
      "\n\n" +
      utils.bold(`Currency: `) + (guild?.currency ? `${CurrencyData[guild.currency].name}` : CurrencyData["USD"].name)
  });
