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
