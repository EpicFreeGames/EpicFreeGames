import { Language } from "../i18n/language";
import { t } from "../i18n/translate";
import { embedUtils } from "./_utils";

export function roleSetEmbed(props: { language: Language; role: string }) {
	return {
		title: "✅",
		color: embedUtils.colors.green,
		description:
			t(props.language, "role_set_success_desc", { role: props.role }) +
			"\n\n" +
			embedUtils.bold(t(props.language, "updated_settings")),
	};
}
