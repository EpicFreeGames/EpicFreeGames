import { constants } from "../../configuration/constants";
import { PermissionString } from "../discordPerms";
import { Language } from "../i18n/language";
import { t } from "../i18n/translate";
import { embedUtils } from "./_utils";

export function channelSetEmbed(language: Language, channelId: string) {
	return {
		title: "✅",
		color: embedUtils.colors.green,
		description:
			t(language, "channel_thread_set_success_desc", { channel: `<#${channelId}>` }) +
			"\n\n" +
			embedUtils.bold(t(language, "updated_settings")),
	};
}

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

export function missingPermsEmbed(channelId: bigint, language: Language, details: Details) {
	return {
		title: "❌",
		color: embedUtils.colors.red,
		description:
			t(language, "bot_missing_perms", { channel: `<#${channelId}>` }) +
			"\n" +
			"```" +
			[...details]
				.map(
					([permission, hasPermission]) =>
						`${permissionMap.get(permission)} ${
							hasPermission ? "✔️" : `❌ ${t(language, "missing")}`
						}`
				)
				.join("\n") +
			"```" +
			"\n" +
			t(language, "support_click_here", { serverInvite: constants.links.serverInvite }),
	};
}

export function maxNumOfWebhooks(language: Language) {
	return {
		title: t(language, "too_many_webhooks"),
		color: embedUtils.colors.red,
		description:
			t(language, "ten_webhooks_only") +
			"\n\n" +
			t(language, "support_click_here", { serverInvite: constants.links.serverInvite }) +
			embedUtils.footer(language),
	};
}
