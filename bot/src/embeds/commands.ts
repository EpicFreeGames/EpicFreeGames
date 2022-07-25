import { Embed } from "discordeno";
import { config } from "../config.ts";
import { t } from "../i18n/translate.ts";
import { Currency, Language, Server } from "../types.ts";
import { colors, utils } from "./embedUtils.ts";

export const help = (language: Language): Embed => ({
  title: "Help",
  color: colors.green,
  description:
    `[${t({ language, key: "commands_listed" })}](${config.LINKS_COMMANDS})` +
    "\n\n" +
    `[${t({ language, key: "support_click_here" })}](${config.LINKS_SERVER_INVITE})` +
    utils.footer(language),
  thumbnail: {
    url: config.PHOTOS_THUMBNAIL,
  },
});

export const vote = (language: Language): Embed => ({
  title: t({ language, key: "vote" }),
  color: colors.blue,
  image: {
    url: config.GIFS_VOTE,
  },
  description: config.LINKS_VOTE,
});

export const invite = (language: Language): Embed => ({
  title: t({ language, key: "invite" }),
  color: colors.blue,
  image: {
    url: config.GIFS_INVITE,
  },
  description: config.LINKS_BOT_INVITE,
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
