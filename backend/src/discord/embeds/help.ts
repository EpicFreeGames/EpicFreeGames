import { constants } from "../../configuration/constants";
import { Language } from "../i18n/language";
import { t } from "../i18n/translate";
import { embedUtils } from "./_utils";

export function helpEmbed(language: Language) {
	return {
		color: embedUtils.colors.gray,
		title: t(language, "help"),
		description:
			`👋 ${t(language, "help_desc")}` +
			"\n\n" +
			`📋 ${t(language, "looking_for_commands", {
				commandsLink: constants.links.frontCommands,
			})}` +
			"\n\n" +
			`🎮 ${t(language, "how_to_tutorial", {
				tutorialLink: constants.links.frontTutorial,
			})}` +
			"\n\n" +
			`⁉️ ${t(language, "having_problems", {
				serverInvite: constants.links.serverInvite,
			})}` +
			"\n\n" +
			`🚩 ${embedUtils.bold(
				t(language, "would_you_like_to_translate", { botName: "EpicFreeGames" })
			)}` +
			"\n" +
			`- ${t(language, "if_would_like_to_translate", {
				serverInvite: constants.links.serverInvite,
			})}`,
	};
}
