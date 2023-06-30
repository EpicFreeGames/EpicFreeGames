import { objToStr } from "../utils";
import { defaultLanguage, languages } from "./languages";
import { translations } from "./t10s";

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split("/");

	return languages[lang || defaultLanguage.code] || defaultLanguage;
}

export function useTranslations(langCode: string) {
	return function t(key: string, vars?: Record<string, string>) {
		const translation = translations[langCode]?.[key] || key;

		if (!vars) {
			return translation;
		} else {
			const keys = Object.keys(vars);
			const varsInTranslation = translation.match(/<[^>]+>/g)?.map((v) => v.slice(1, -1));

			if (!varsInTranslation) {
				throw new Error(`No variables to replace in translation: ${key}`);
			} else if (varsInTranslation.length !== keys.length) {
				const missingVars = varsInTranslation.filter((v) => !keys.includes(v));
				const extraVars = keys.filter((v) => !varsInTranslation.includes(v));

				console.log({
					keys,
					translation,
					key,
					langCode,
					missingVars,
					extraVars,
					varsInTranslation,
				});

				throw new Error(
					`Different amount of variables on translation ${key}:` +
						"\n\n" +
						`Variables given to t(): \n${objToStr(vars)}` +
						"\n\n" +
						(!!missingVars.length
							? `Missing variables: \n${objToStr(missingVars)}`
							: "") +
						(!!extraVars.length
							? `Extra variables: \n${objToStr(extraVars)}` + "\n\n"
							: "") +
						`Variables in translation: \n${objToStr(varsInTranslation)}`
				);
			}

			return varsInTranslation.reduce((acc, variable) => {
				const value = vars[variable];

				if (!value) {
					const missingVars = varsInTranslation.filter((v) => !keys.includes(v));
					const extraVars = keys.filter((v) => !varsInTranslation.includes(v));

					console.log({
						keys,
						translation,
						key,
						langCode,
						missingVars,
						extraVars,
						varsInTranslation,
					});

					throw new Error(
						`Different amount of variables on translation ${key}:` +
							"\n\n" +
							`Variables given to t(): \n${objToStr(vars)}` +
							"\n\n" +
							(!!missingVars.length
								? `Missing variables: \n${objToStr(missingVars)}`
								: "") +
							(!!extraVars.length
								? `Extra variables: \n${objToStr(extraVars)}` + "\n\n"
								: "") +
							`Variables in translation: \n${objToStr(varsInTranslation)}`
					);
				}

				return acc.replace(`<${variable}>`, value);
			}, translation);
		}
	};
}
