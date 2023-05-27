import { Language } from "../i18n/language";
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
