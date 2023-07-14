import { constants } from "../../configuration/constants";
import { Language } from "../i18n/language";
import { t } from "../i18n/translate";
import { embedUtils } from "./_utils";

export function genericErrorEmbed(props: { language: Language; requestId: string }) {
	return {
		title: "Error",
		color: embedUtils.colors.red,
		description:
			"An error occured. :( Please try again later." +
			"\n\n" +
			`Request ID: ${props.requestId}`,
	};
}

export function botAdminOnlyCommandError(language: Language) {
	return {
		title: "❌",
		color: embedUtils.colors.red,
		description: t(language, "bot_admins_only"),
	};
}

export function manageGuildCommandError(language: Language) {
	return {
		title: "❌",
		color: embedUtils.colors.red,
		description:
			t(language, "manage_guild_needed") +
			"\n\n" +
			t(language, "support_click_here", { serverInvite: constants.links.serverInvite }) +
			embedUtils.footer(language),
	};
}

export function channelNotSetEmbed(language: Language) {
	return {
		title: "❌",
		color: embedUtils.colors.red,
		description: t(language, "set_channel_first") + embedUtils.footer(language),
	};
}
