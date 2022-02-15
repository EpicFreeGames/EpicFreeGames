import { MessageEmbed } from "discord.js";
import { Languages } from "../localisation/languages";
import { translate } from "../localisation";
import { utils } from "./utils";
import { constants } from "config";

export const missingPermissions = (channelId: string, language: Languages): MessageEmbed =>
  new MessageEmbed({
    title: "❌",
    color: "DARK_RED",
    description:
      translate("no_permission_desc", language, { channelId }) +
      "\n\n" +
      `**${translate("permission_manage_webhooks", language)}**` +
      "\n\n" +
      translate("click_here", language, { serverAddress: constants.links.serverInvite }),
  });

export const unauthorized = {
  adminOnlyCommand: (language: Languages) =>
    new MessageEmbed({
      title: "❌",
      color: "DARK_RED",
      description: "**Admin only** command" + utils.footer(language),
    }),

  manageGuildCommand: (language: Languages) =>
    new MessageEmbed({
      title: "❌",
      color: "DARK_RED",
      description: translate("error_manage_guild_title", language) + utils.footer(language),
    }),
};

export const maxNumberOfWebhooks = (language: Languages) =>
  new MessageEmbed({
    title: "Too many webhooks",
    color: "RED",
    description: "A channel can only have 10 webhooks." + utils.footer(language),
  });

export const mustVote = (language: Languages) =>
  new MessageEmbed({
    title: translate("need_to_vote_title", language),
    color: "RED",
    description:
      translate("need_to_vote_description", language, { voteAddress: constants.links.vote }) +
      utils.footer(language),
  });

export const genericError = () =>
  new MessageEmbed({
    title: "Error",
    color: "RED",
    description: "An error occured. :( Please try again later.",
  });
