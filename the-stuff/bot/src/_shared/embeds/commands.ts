import { Embed } from "discordeno";

import { botConstants } from "../constants.ts";
import { t } from "../i18n/translate.ts";
import { sharedConfig } from "../sharedConfig.ts";
import { Currency, Language, Server } from "../types.ts";
import { colors, utils } from "./embedUtils.ts";

export const help = (language: Language): Embed => ({
  color: colors.gray,
  author: {
    name: "Help",
    iconUrl: botConstants.emojis.questionMark,
  },
  description:
    `👋 ${t({ language, key: "help_desc" })}` +
    "\n\n" +
    `📋 ${t({
      language,
      key: "looking_for_commands",
      vars: { commandsLink: botConstants.website.commands },
    })}` +
    "\n\n" +
    `🎮 ${t({
      language,
      key: "how_to_tutorial",
      vars: { tutorialLink: botConstants.website.tutorial },
    })}` +
    "\n\n" +
    `⁉️ ${t({
      language,
      key: "having_problems",
      vars: { serverInvite: botConstants.website.serverInvite },
    })}` +
    "\n\n" +
    `🚩 ${utils.bold(
      t({ language, key: "would_you_like_to_translate", vars: { botName: "EpicFreeGames" } })
    )}` +
    "\n" +
    `- ${t({
      language,
      key: "if_would_like_to_translate",
      vars: { serverInvite: botConstants.website.serverInvite },
    })}` +
    utils.footer(language),
  thumbnail: {
    url: sharedConfig.LOGO_URL,
  },
});

export const vote = (language: Language): Embed => ({
  title: t({ language, key: "vote" }),
  color: colors.gray,
  description:
    Object.entries(botConstants.voteLinks)
      .map(([name, link]) => `${utils.bold(name)}\n${link}`)
      .join("\n\n") + utils.footer(language),
});

export const invite = (language: Language): Embed => ({
  title: t({ language, key: "invite" }),
  color: colors.gray,
  image: {
    url: botConstants.inviteGif,
  },
  description: botConstants.website.botInvite,
});

export const debug = (guildId: string): Embed => ({
  title: "Debug info",
  color: colors.gray,
  description: utils.bold(`Guild ID: ${guildId}`),
});

export const settings = (
  server: Server | undefined,
  language: Language,
  currency: Currency
): Embed => ({
  title: t({ language, key: "settings" }),
  color: colors.gray,
  description:
    utils.bold(`${t({ language, key: "channel" })}/${t({ language, key: "thread" })}:\n`) +
    settingsUtils.showChannelOrThread(server, language) +
    "\n\n" +
    utils.bold(`${t({ language, key: "role" })}:\n`) +
    settingsUtils.showRole(server, language) +
    "\n\n" +
    utils.bold(`${t({ language, key: "language" })}:\n`) +
    language.nativeName +
    "\n\n" +
    utils.bold(`${t({ language, key: "currency" })}:\n`) +
    currency.name +
    utils.footer(language),
});

const settingsUtils = {
  showChannelOrThread: (server: Server | undefined, language: Language) => {
    if (server?.threadId) {
      return `<#${server?.threadId}>`;
    } else if (server?.channelId) {
      return `<#${server?.channelId}>`;
    } else {
      return t({ language, key: "channel_thread_not_set" });
    }
  },

  showRole: (server: Server | undefined, language: Language) => {
    if (server?.roleId) {
      if (server.roleId === "1") return "@everyone";

      return `<@&${server?.roleId}>`;
    } else {
      return t({ language, key: "role_not_set" });
    }
  },
};
