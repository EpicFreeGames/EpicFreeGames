import { Embed } from "discordeno";
import { config } from "~config";
import { t } from "../i18n/translate.ts";
import { Language } from "../types.ts";
import { ResultMap } from "../utils/hasPerms.ts";
import { colors, utils } from "./embedUtils.ts";

// prettier-ignore
const permissionMap = new Map([
  ["MANAGE_WEBHOOKS",          "Manage webhooks          "],
  ["VIEW_CHANNEL",             "View channel             "],
  ["SEND_MESSAGES",            "Send messages            "],
  ["MENTION_EVERYONE",         "Mention everyone         "],
  ["EMBED_LINKS",              "Embed links              "],
  ["SEND_MESSAGES_IN_THREADS", "Send messages in threads "],
]);

export const missingPermissions = (
  channelId: bigint,
  language: Language,
  missingPerms: ResultMap
): Embed => ({
  title: "❌",
  color: colors.red,
  description:
    t({ language, key: "make_sure_perms", vars: { channel: `<#${channelId}>` } }) +
    "\n" +
    "```" +
    missingPerms
      .map(
        (r, perm) =>
          `${permissionMap.get(perm)} ${r ? "✅" : `❌ ${t({ language, key: "missing" })}`}`
      )
      .join("\n") +
    "```" +
    "\n" +
    utils.link(t({ language, key: "support_click_here" }), config.LINKS_SERVER_INVITE),
});

export const unauthorized = {
  adminOnlyCommand: (language: Language): Embed => ({
    title: "❌",
    color: colors.red,
    description: t({ language, key: "bot_admins_only" }) + utils.footer(language),
  }),

  manageGuildCommand: (language: Language): Embed => ({
    title: "❌",
    color: colors.red,
    description:
      t({ language, key: "manage_guild_needed" }) +
      "\n\n" +
      utils.link(t({ language, key: "support_click_here" }), config.LINKS_SERVER_INVITE) +
      utils.footer(language),
  }),
};

export const maxNumberOfWebhooks = (language: Language): Embed => ({
  title: t({ language, key: "too_many_webhooks" }),
  color: colors.red,
  description:
    t({ language, key: "ten_webhooks_only" }) +
    "\n\n" +
    utils.link(t({ language, key: "support_click_here" }), config.LINKS_SERVER_INVITE) +
    utils.footer(language),
});

export const channelNotSet = (language: Language): Embed => ({
  title: "❌",
  color: colors.red,
  description: t({ language, key: "set_channel_first" }) + utils.footer(language),
});

export const genericError = (): Embed => ({
  title: "Error",
  color: colors.red,
  description: "An error occured. :( Please try again later.",
});
