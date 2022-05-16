import { MessageEmbed } from "discord.js";
import { CurrencyData, Languages, LanguageNames, t } from "../localisation";
import { constants } from "config";
import { utils } from "./utils";
import { IGuild } from "../data/types";

export const help = (language: Languages) =>
  new MessageEmbed({
    title: "Help",
    color: "GREEN",
    description:
      `[${t("commands_listed", language)}](${constants.links.commands})` +
      "\n\n" +
      `[${t("support_click_here", language)}](${constants.links.serverInvite})` +
      utils.footer(language),
  }).setThumbnail(constants.photos.thumbnail);

export const vote = (language: Languages) =>
  new MessageEmbed({
    title: t("vote_needed_title", language),
    color: "BLUE",
    image: {
      url: constants.gifs.vote,
    },
    description: constants.links.vote,
  });

export const invite = (language: Languages) =>
  new MessageEmbed({
    title: t("invite", language),
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
    title: t("settings", language),
    color: "#2f3136",
    description:
      utils.bold(`${t("channel", language)}/${t("thread", language)}: ` ) + 
        settingsUtils.showChannelOrThread(guild, language) + 
      "\n\n" +
      utils.bold(`${t("role", language)}: `) + settingsUtils.showRole(guild, language) +
      "\n\n" +
      utils.bold(`${t("language", language)}: `) + (guild?.language ? `${LanguageNames[guild.language]}` : LanguageNames[Languages.en]) +
      "\n\n" +
      utils.bold(`${t("currency", language)}: `) + (guild?.currency ? `${CurrencyData[guild.currency].name}` : CurrencyData["USD"].name) +
      utils.footer(language),
  });

const settingsUtils = {
  showChannelOrThread: (guild: IGuild | null, language: Languages) => {
    if (guild?.channelId) {
      return `<#${guild?.channelId}>`;
    } else if (guild?.threadId) {
      return `<#${guild?.threadId}>`;
    } else {
      return t("channel_thread_not_set", language);
    }
  },

  showRole: (guild: IGuild | null, language: Languages) => {
    if (guild?.roleId) {
      if (guild.roleId === "1") return "@everyone";

      return `<@&${guild?.roleId}>`;
    } else {
      return t("role_not_set", language);
    }
  },
};
