import { MessageEmbed } from "discord.js";
import { Languages, t } from "../localisation";
import { utils } from "./utils";
import { constants } from "config";

export const missingPermissions = (channelId: string, language: Languages): MessageEmbed =>
  new MessageEmbed({
    title: "❌",
    color: "DARK_RED",
    description:
      t("make_sure_perms", language, { channelId }) +
      "\n\n" +
      utils.bold(`${t("manage_webhooks", language)}`) +
      "\n\n" +
      utils.link(t("support_click_here", language), constants.links.serverInvite),
  });

export const unauthorized = {
  adminOnlyCommand: (language: Languages) =>
    new MessageEmbed({
      title: "❌",
      color: "DARK_RED",
      description: t("bot_admins_only", language) + utils.footer(language),
    }),

  manageGuildCommand: (language: Languages) =>
    new MessageEmbed({
      title: "❌",
      color: "DARK_RED",
      description:
        t("manage_guild_needed", language) +
        "\n\n" +
        utils.link(t("support_click_here", language), constants.links.serverInvite) +
        utils.footer(language),
    }),
};

export const maxNumberOfWebhooks = (language: Languages) =>
  new MessageEmbed({
    title: t("too_many_webhooks", language),
    color: "RED",
    description:
      t("ten_webhooks_only", language) +
      "\n\n" +
      utils.link(t("support_click_here", language), constants.links.serverInvite) +
      utils.footer(language),
  });

export const channelNotSet = (language: Languages) =>
  new MessageEmbed({
    title: "❌",
    color: "RED",
    description: t("set_channel_first", language) + utils.footer(language),
  });

export const mustVote = (language: Languages) =>
  new MessageEmbed({
    title: t("vote_needed_title", language),
    color: "RED",
    description:
      utils.link(t("vote_click_here", language), constants.links.vote) + utils.footer(language),
  });

export const genericError = () =>
  new MessageEmbed({
    title: "Error",
    color: "RED",
    description: "An error occured. :( Please try again later.",
  });

export const error = (msg: string) =>
  new MessageEmbed({
    title: "Error",
    color: "RED",
    description: msg,
  }).setTimestamp();
