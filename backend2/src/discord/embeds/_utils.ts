import { constants } from "../../configuration/constants";
import { Language } from "../i18n/language";
import { t } from "../i18n/translate";

export const embedUtils = {
	footer: (language: Language) => "\n\n" + createFooter(language),

	relativeTimestamp: (timestamp: number) => `<t:${timestamp}:R>`,
	longTime: (timestamp: number) => `<t:${timestamp}:T>`,

	link: (text: string, url: string) => `[${text}](${url})`,

	strike: (text: string) => `~~${text}~~`,
	bold: (text: string) => `**${text}**`,
	title: (text: string) => `__** ${text} **__`,

	colors: {
		green: 0x008000,
		red: 0xce3e3e,
		blue: 0x3f3fff,
		white: 0xffffff,
		gray: 0x2f3136,
	},

	chars: {
		separator: "   •   ",
		arrow: "  ➜  ",
	},
};

const createFooter = (language: Language) => {
	const invite = t(language, "invite");
	const support = t(language, "support");
	const website = t(language, "website");

	const list = [invite, support, website];
	const withVars = [
		embedUtils.link(invite, constants.links.botInvite),
		embedUtils.link(support, constants.links.serverInvite),
		embedUtils.link(website, constants.links.frontHome),
	];

	const concatted = list.join(embedUtils.chars.separator);
	const threeConcatted = list.slice(0, 3).join(embedUtils.chars.separator);

	// if the footer is too long, try to break it,
	// otherwise, just use the full footer

	if (concatted.length >= 39)
		if (threeConcatted.length >= 39)
			// 2 lines, with one on the second line
			return (
				withVars.slice(0, 2).join(embedUtils.chars.separator) +
				"\n" +
				withVars.slice(2).join(embedUtils.chars.separator)
			);

	return withVars.join(embedUtils.chars.separator);
};
