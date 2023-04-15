import { getTranslations } from "./getTranslations";

export type Translations = { [key: string]: string } & { __type: "Translations" };
export type TFunction = ((key: string) => string) & { __type: "TFunction" };

export const i18n = {
	defaultLocale: "en",
	locales: ["en", "de", "cs"],
} as const;

export type Locale = typeof i18n["locales"][number];
export function isValidLocale(locale: string): locale is Locale {
	return i18n.locales.includes(locale as Locale);
}

export async function getT(locale: Locale): Promise<TFunction> {
	const translations = await getTranslations(locale);

	return ((key: string, vars: { [key: string]: string }) => {
		const translation = translations?.[key as keyof typeof translations];

		if (!translation) {
			console.log(`Missing translation for key: ${key}`);

			return key;
		}

		const varKeys = vars ? Object.keys(vars) : undefined;

		const fullTranslation =
			varKeys && varKeys.length
				? varKeys.reduce((acc, key) => {
						return acc.replace(`<${key}>`, vars[key]);
				  }, translation)
				: translation;

		return fullTranslation;
	}) as TFunction;
}
