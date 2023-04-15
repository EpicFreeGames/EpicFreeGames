import "server-only";

import { type Locale, isValidLocale } from "./i18n";

const translations = {
	en: async () => {
		const commands = await import("./t10s/en/commands.json").then((module) => module.default);
		const messages = await import("./t10s/en/messages.json").then((module) => module.default);
		const website = await import("./t10s/en/website.json").then((module) => module.default);

		return {
			...commands,
			...messages,
			...website,
		};
	},
	de: async () => {
		const commands = await import("./t10s/de/commands.json").then((module) => module.default);
		const messages = await import("./t10s/de/messages.json").then((module) => module.default);
		const website = await import("./t10s/de/website.json").then((module) => module.default);

		return {
			...commands,
			...messages,
			...website,
		};
	},
	cs: async () => {
		const commands = await import("./t10s/cs/commands.json").then((module) => module.default);
		const messages = await import("./t10s/cs/messages.json").then((module) => module.default);
		const website = await import("./t10s/cs/website.json").then((module) => module.default);

		return {
			...commands,
			...messages,
			...website,
		};
	},
} as const;

export async function getTranslations(locale: Locale) {
	if (!isValidLocale(locale)) {
		console.warn(`${locale} is not a valid locale, returning translations for en`);

		return await translations.en();
	}

	const ts = await translations[locale]();

	return ts;
}
