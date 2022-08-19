import { Embed } from "discordeno";

import { config } from "../../config.ts";
import { botConstants } from "../constants.ts";
import { t } from "../i18n/translate.ts";
import { Currency, Language, Server } from "../types.ts";
import { colors, utils } from "./embedUtils.ts";

export const help = (language: Language): Embed => ({
  title: "Help",
  color: colors.green,
  description:
    `[${t({ language, key: "commands_listed" })}](${botConstants.websiteCommands})` +
    "\n\n" +
    `[${t({ language, key: "support_click_here" })}](${botConstants.serverInvite})` +
    utils.footer(language),
  thumbnail: {
    url: botConstants.botLogoUrl(config.ENV),
  },
});

export const vote = (language: Language): Embed => ({
  title: t({ language, key: "vote" }),
  color: colors.blue,
  description:
    Object.entries(botConstants.voteLinks)
      .map(([name, link]) => `${utils.bold(name)}\n${link}`)
      .join("\n\n") + utils.footer(language),
});

export const invite = (language: Language): Embed => ({
  title: t({ language, key: "invite" }),
  color: colors.blue,
  image: {
    url: botConstants.inviteGif,
  },
  description: botConstants.botInvite,
});

export const debug = (guildId: string): Embed => ({
  title: "Debug info",
  color: colors.blue,
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
