import { Embed } from "discordeno";
import { config } from "../config.ts";
import { t } from "../i18n/translate.ts";
import { Language, Server } from "../types.ts";
import { colors, utils } from "./embedUtils.ts";

export const help = (language: Language): Embed => ({
  title: "Help",
  color: colors.green,
  description:
    `[${t(language, "commands_listed")}](${config.LINKS_COMMANDS})` +
    "\n\n" +
    `[${t(language, "support_click_here")}](${config.LINKS_SERVER_INVITE})` +
    utils.footer(language),
  thumbnail: {
    url: config.PHOTOS_THUMBNAIL,
  },
});

export const vote = (language: Language): Embed => ({
  title: t(language, "vote"),
  color: colors.blue,
  image: {
    url: config.GIFS_VOTE,
  },
  description: config.LINKS_VOTE,
});

export const invite = (language: Language): Embed => ({
  title: t(language, "invite"),
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
  language: Language
): Embed => ({
  title: t(language, "settings"),
  color: colors.gray,
  description:
    utils.bold(`${t(language, "channel")}/${t(language, "thread")}: `) +
    settingsUtils.showChannelOrThread(server, language) +
    "\n\n" +
    utils.bold(`${t(language, "role")}: `) +
    settingsUtils.showRole(server, language) +
    "\n\n" +
    utils.bold(`${t(language, "language")}: `) +
    (server?.language?.nativeName ?? "English") +
    "\n\n" +
    utils.bold(`${t(language, "currency")}: `) +
    (server?.currency?.name ?? "$ Dollar (USD)") +
    utils.footer(language),
});

const settingsUtils = {
  showChannelOrThread: (server: Server | undefined, language: Language) => {
    if (server?.channelId) {
      return `<#${server?.channelId}>`;
    } else if (server?.threadId) {
      return `<#${server?.threadId}>`;
    } else {
      return t(language, "channel_thread_not_set");
    }
  },

  showRole: (server: Server | undefined, language: Language) => {
    if (server?.roleId) {
      if (server.roleId === "1") return "@everyone";

      return `<@&${server?.roleId}>`;
    } else {
      return t(language, "role_not_set");
    }
  },
};
