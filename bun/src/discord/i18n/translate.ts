import { Language } from "./language";
import { translations } from "./translations";

const variableStart = "<";
const variableEnd = ">";

export function t(language: Language, key: string, vars: Record<string, string>) {
	const langTranslations = translations.get(language.code);

	let translation = langTranslations?.[key] ?? translations.get("en")?.[key];

	if (!translation) {
		return key;
	}

	if (vars && Object.keys(vars).length) {
		Object.keys(vars).forEach((variable) => {
			translation = translation?.replace(
				`${variableStart}${variable}${variableEnd}`,
				(vars as any)[variable as any]
			);
		});
	}

	return translation;
}
