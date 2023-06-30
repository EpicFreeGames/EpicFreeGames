import { objToStr } from "../utils";
import { defaultLanguage, languages } from "./languages";
import { translations } from "./t10s";

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split("/");

	return languages[lang || defaultLanguage.code] || defaultLanguage;
}

export function useTranslations(langCode: string) {
	return function t(key: string, vars?: Record<string, string | number>) {
		const translation = translations[langCode]?.[key] || key;

		if (!vars) {
			return translation;
		} else {
			const keys = Object.keys(vars);
			const varsInTranslation = translation.match(/(?<=<).+?(?=>)/g);

			if (!varsInTranslation) {
				throw new Error(`No variables to replace in translation: ${key}`);
			} else if (varsInTranslation.length !== keys.length) {
				const missingVars = varsInTranslation.filter((v) => !keys.includes(v));

				throw new Error(
					`Different amount of variables on translation ${key}:` +
						"\n\n" +
						`Variables given to t(): \n${objToStr(vars)}` +
						"\n\n" +
						`Missing variables: \n${objToStr(missingVars)}` +
						"\n\n" +
						`Variables in translation: \n${objToStr(varsInTranslation)}`
				);
			}

			return varsInTranslation.reduce(
				(acc, variable) => acc.replace(`<${variable}>`, vars[variable]!.toString()),
				translation
			);
		}
	};
}
