import { MessageEmbed } from "discord.js";
import { Languages, translate } from "../localisation";
import { utils } from "./utils";
import { constants } from "config";

export const missingPermissions = (channelId: string, language: Languages): MessageEmbed =>
  new MessageEmbed({
    title: "❌",
    color: "DARK_RED",
    description:
      translate(`missingPermsDesc.${language}`, { channelId }) +
      "\n\n" +
      utils.bold(`${translate(`manageWebhooks.${language}`)}`) +
      "\n\n" +
      translate(`clickHere.${language}`, { serverAddress: constants.links.serverInvite }),
  });

export const unauthorized = {
  adminOnlyCommand: (language: Languages) =>
    new MessageEmbed({
      title: "❌",
      color: "DARK_RED",
      description: `${utils.bold("Admin only")} command` + utils.footer(language),
    }),

  manageGuildCommand: (language: Languages) =>
    new MessageEmbed({
      title: "❌",
      color: "DARK_RED",
      description:
        translate(`noManageGuild.${language}`) +
        "\n\n" +
        translate(`clickHere.${language}`, { serverAddress: constants.links.serverInvite }) +
        utils.footer(language),
    }),
};

export const maxNumberOfWebhooks = (language: Languages) =>
  new MessageEmbed({
    title: "Too many webhooks",
    color: "RED",
    description: "A channel can only have 10 webhooks." + utils.footer(language),
  });

export const channelNotSet = (language: Languages) =>
  new MessageEmbed({
    title: "❌",
    color: "RED",
    description: translate(`noChannelSet.${language}`) + utils.footer(language),
  });

export const mustVote = (language: Languages) =>
  new MessageEmbed({
    title: translate(`mustVoteTitle.${language}`),
    color: "RED",
    description:
      translate(`mustVoteDesc.${language}`, { voteAddress: constants.links.vote }) +
      utils.footer(language),
  });

export const genericError = () =>
  new MessageEmbed({
    title: "Error",
    color: "RED",
    description: "An error occured. :( Please try again later.",
  });
