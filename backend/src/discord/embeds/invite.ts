import { constants } from "../../configuration/constants";
import { Language } from "../i18n/language";
import { t } from "../i18n/translate";
import { embedUtils } from "./_utils";

export function inviteEmbed(language: Language) {
	return {
		title: t(language, "invite"),
		color: embedUtils.colors.gray,
		description: constants.links.botInvite + "\n\n" + t(language, "thank_you"),
	};
}
