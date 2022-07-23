import { Embed } from "discordeno";
import { ResultMap } from "../bot/helpers/hasPerms.ts";
import { config } from "../config.ts";
import { t } from "../i18n/translate.ts";
import { Language } from "../types.ts";
import { utils } from "./embedUtils.ts";

const permissionMap = new Map([
  ["MANAGE_WEBHOOKS", "Manage webhooks"],
  ["VIEW_CHANNEL", "View channel"],
]);

export const missingPermissions = (
  channelId: bigint,
  language: Language,
  missingPerms: ResultMap
): Embed => ({
  title: "❌",
  color: 0x8b0000,
  description:
    t(language, "make_sure_perms", { channel: `<#${channelId}>` }) +
    "\n\n" +
    missingPerms
      .map((r, perm) => `${permissionMap.get(perm)} ${r ? "✅" : "❌"}`)
      .join("\n") +
    "\n\n" +
    utils.link(t(language, "support_click_here"), config.LINKS_SERVER_INVITE),
});

export const unauthorized = {
  adminOnlyCommand: (language: Language): Embed => ({
    title: "❌",
    color: 0x8b0000,
    description: t(language, "bot_admins_only") + utils.footer(language),
  }),

  manageGuildCommand: (language: Language): Embed => ({
    title: "❌",
    color: 0x8b0000,
    description:
      t(language, "manage_guild_needed") +
      "\n\n" +
      utils.link(
        t(language, "support_click_here"),
        config.LINKS_SERVER_INVITE
      ) +
      utils.footer(language),
  }),
};

export const maxNumberOfWebhooks = (language: Language): Embed => ({
  title: t(language, "too_many_webhooks"),
  color: 0x8b0000,
  description:
    t(language, "ten_webhooks_only") +
    "\n\n" +
    utils.link(t(language, "support_click_here"), config.LINKS_SERVER_INVITE) +
    utils.footer(language),
});

export const channelNotSet = (language: Language): Embed => ({
  title: "❌",
  color: 0x8b0000,
  description: t(language, "set_channel_first") + utils.footer(language),
});

export const genericError = (): Embed => ({
  title: "Error",
  color: 0x8b0000,
  description: "An error occured. :( Please try again later.",
});
