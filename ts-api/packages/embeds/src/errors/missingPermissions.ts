import { botConstants } from "@efg/configuration";
import { t } from "@efg/i18n";
import { IEmbed, ILanguage, PermissionString } from "@efg/types";

import { embedUtils } from "../_utils";

// prettier-ignore
const permissionMap = new Map([
  ["MANAGE_WEBHOOKS",          "Manage webhooks          "],
  ["VIEW_CHANNEL",             "View channel             "],
  ["SEND_MESSAGES",            "Send messages            "],
  ["MENTION_EVERYONE",         "Mention everyone         "],
  ["EMBED_LINKS",              "Embed links              "],
  ["SEND_MESSAGES_IN_THREADS", "Send messages in threads "],
]);

type Details = Map<PermissionString, boolean>;

export default (channelId: bigint, language: ILanguage, details: Details): IEmbed => ({
  title: "❌",
  color: embedUtils.colors.red,
  description:
    t({ language, key: "bot_missing_perms", vars: { channel: `<#${channelId}>` } }) +
    "\n" +
    "```" +
    [...details]
      .map(
        ([permission, hasPermission]) =>
          `${permissionMap.get(permission)} ${
            hasPermission ? "✔️" : `❌ ${t({ language, key: "missing" })}`
          }`
      )
      .join("\n") +
    "```" +
    "\n" +
    t({
      language,
      key: "support_click_here",
      vars: { serverInvite: botConstants.website.serverInvite },
    }),
});
