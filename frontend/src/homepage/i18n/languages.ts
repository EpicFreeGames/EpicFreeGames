import type { Language } from "./i18nTypes";

/**
 * Map<LanguageCode, Language>
 *
 * @example
 * {
 *   "en": {
 *     "englishName": "English",
 *     ...
 *   },
 * }
 */
export const languagesMap = new Map<
	string,
	Language & { websiteReady: boolean }
>([
	[
		"af",
		{
			code: "af",
			name: "Afrikaans",
			nativeName: "Afrikaans",
			websiteReady: true,
		},
	],
	[
		"ar",
		{
			code: "ar",
			name: "Arabic",
			nativeName: "عربي",
			websiteReady: false,
		},
	],
	[
		"az",
		{
			code: "az",
			name: "Azerbaijani",
			nativeName: "Azərbaycan",
			websiteReady: false,
		},
	],
	[
		"bg",
		{
			code: "bg",
			name: "Bulgarian",
			nativeName: "Български",
			websiteReady: true,
		},
	],
	[
		"cs",
		{
			code: "cs",
			name: "Czech",
			nativeName: "Čeština",
			websiteReady: false,
		},
	],
	[
		"de",
		{
			code: "de",
			name: "German",
			nativeName: "Deutsch",
			websiteReady: true,
		},
	],
	[
		"en",
		{
			code: "en",
			name: "English",
			nativeName: "English",
			websiteReady: true,
		},
	],
	[
		"es-ES",
		{
			code: "es-ES",
			name: "Spanish",
			nativeName: "Español",
			websiteReady: true,
		},
	],
	[
		"fa",
		{
			code: "fa",
			name: "Persian",
			nativeName: "فارسی",
			websiteReady: false,
		},
	],
	[
		"fr",
		{
			code: "fr",
			name: "French",
			nativeName: "Français",
			websiteReady: false,
		},
	],
	[
		"he",
		{
			code: "he",
			name: "Hebrew",
			nativeName: "עברית",
			websiteReady: false,
		},
	],
	[
		"hi",
		{
			code: "hi",
			name: "Hindi",
			nativeName: "हिन्दी",
			websiteReady: false,
		},
	],
	[
		"hu",
		{
			code: "hu",
			name: "Hungarian",
			nativeName: "Magyar",
			websiteReady: false,
		},
	],
	[
		"id",
		{
			code: "id",
			name: "Indonesian",
			nativeName: "Bahasa Indonesia",
			websiteReady: true,
		},
	],
	[
		"it",
		{
			code: "it",
			name: "Italian",
			nativeName: "Italiano",
			websiteReady: false,
		},
	],
	[
		"ja",
		{
			code: "ja",
			name: "Japanese",
			nativeName: "日本語",
			websiteReady: false,
		},
	],
	[
		"ka",
		{
			code: "ka",
			name: "Georgian",
			nativeName: "ქართული",
			websiteReady: false,
		},
	],
	[
		"ko",
		{
			code: "ko",
			name: "Korean",
			nativeName: "한국어",
			websiteReady: true,
		},
	],
	[
		"mk",
		{
			code: "mk",
			name: "Macedonian",
			nativeName: "Македонски",
			websiteReady: false,
		},
	],
	[
		"nl",
		{
			code: "nl",
			name: "Dutch",
			nativeName: "Nederlands",
			websiteReady: false,
		},
	],
	[
		"pl",
		{
			code: "pl",
			name: "Polish",
			nativeName: "Polski",
			websiteReady: true,
		},
	],
	[
		"pt-BR",

		{
			code: "pt-BR",
			name: "Portuguese (Brazil)",
			nativeName: "Português (Brasil)",
			websiteReady: true,
		},
	],
	[
		"pt-PT",

		{
			code: "pt-PT",
			name: "Portuguese (Portugal)",
			nativeName: "Português (Portugal)",
			websiteReady: false,
		},
	],
	[
		"ro",
		{
			code: "ro",
			name: "Romanian",
			nativeName: "Română",
			websiteReady: false,
		},
	],
	[
		"ru",
		{
			code: "ru",
			name: "Russian",
			nativeName: "Русский",
			websiteReady: true,
		},
	],
	[
		"sr",
		{
			code: "sr",
			name: "Serbian",
			nativeName: "Српски",
			websiteReady: false,
		},
	],
	[
		"sr-CS",
		{
			code: "sr-CS",
			name: "Serbian (Cyrillic)",
			nativeName: "Српски (Ћирилица)",
			websiteReady: false,
		},
	],
	[
		"tr",
		{
			code: "tr",
			name: "Turkish",
			nativeName: "Türkçe",
			websiteReady: true,
		},
	],
	[
		"uk",
		{
			code: "uk",
			name: "Ukrainian",
			nativeName: "Українська",
			websiteReady: true,
		},
	],
	[
		"vi",
		{
			code: "vi",
			name: "Vietnamese",
			nativeName: "Tiếng Việt",
			websiteReady: true,
		},
	],
	[
		"zh-TW",
		{
			code: "zh-TW",
			name: "Chinese (Traditional)",
			nativeName: "繁體中文",
			websiteReady: true,
		},
	],
]);

// language map as object
export const languages: Record<string, Language> = {
	az: {
		code: "az",
		name: "Azerbaijani",
		nativeName: "Azərbaycanca / آذربايجان",
		websiteReady: false,
	},
	bg: {
		code: "bg",
		name: "Bulgarian",
		nativeName: "Български",
		websiteReady: false,
	},
	cs: {
		code: "cs",
		name: "Czech",
		nativeName: "Čeština",
		websiteReady: false,
	},
	de: {
		code: "de",
		name: "German",
		nativeName: "Deutsch",
		websiteReady: true,
	},
	en: {
		code: "en",
		name: "English",
		nativeName: "English",
		websiteReady: true,
	},
	"es-ES": {
		code: "es-ES",
		name: "Spanish",
		nativeName: "Español",
		websiteReady: true,
	},
	fa: {
		code: "fa",
		name: "Persian",
		nativeName: "فارسی",
		websiteReady: false,
	},
	fr: {
		code: "fr",
		name: "French",
		nativeName: "Français",
		websiteReady: false,
	},
	he: {
		code: "he",
		name: "Hebrew",
		nativeName: "עברית",
		websiteReady: false,
	},
	hi: {
		code: "hi",
		name: "Hindi",
		nativeName: "हिन्दी",
		websiteReady: false,
	},
	hu: {
		code: "hu",
		name: "Hungarian",
		nativeName: "Magyar",
		websiteReady: false,
	},
	id: {
		code: "id",
		name: "Indonesian",
		nativeName: "Bahasa Indonesia",
		websiteReady: true,
	},
	it: {
		code: "it",
		name: "Italian",
		nativeName: "Italiano",
		websiteReady: false,
	},
	ja: {
		code: "ja",
		name: "Japanese",
		nativeName: "日本語",
		websiteReady: false,
	},
	ka: {
		code: "ka",
		name: "Georgian",
		nativeName: "ქართული",
		websiteReady: false,
	},
	ko: {
		code: "ko",
		name: "Korean",
		nativeName: "한국어",
		websiteReady: false,
	},
	mk: {
		code: "mk",
		name: "Macedonian",
		nativeName: "Македонски",
		websiteReady: false,
	},
	nl: {
		code: "nl",
		name: "Dutch",
		nativeName: "Nederlands",
		websiteReady: false,
	},
	pl: {
		code: "pl",
		name: "Polish",
		nativeName: "Polski",
		websiteReady: false,
	},
	"pt-BR": {
		code: "pt-BR",
		name: "Portuguese (Brazil)",
		nativeName: "Português (Brasil)",
		websiteReady: true,
	},
	"pt-PT": {
		code: "pt-PT",
		name: "Portuguese (Portugal)",
		nativeName: "Português (Portugal)",
		websiteReady: false,
	},
	ro: {
		code: "ro",
		name: "Romanian",
		nativeName: "Română",
		websiteReady: false,
	},
	ru: {
		code: "ru",
		name: "Russian",
		nativeName: "Русский",
		websiteReady: false,
	},
	sr: {
		code: "sr",
		name: "Serbian",
		nativeName: "Српски",
		websiteReady: false,
	},
	"sr-CS": {
		code: "sr-CS",
		name: "Serbian (Cyrillic)",
		nativeName: "Српски (ћирилица)",
		websiteReady: false,
	},
	tr: {
		code: "tr",
		name: "Turkish",
		nativeName: "Türkçe",
		websiteReady: true,
	},
	uk: {
		code: "uk",
		name: "Ukrainian",
		nativeName: "Українська",
		websiteReady: true,
	},
	vi: {
		code: "vi",
		name: "Vietnamese",
		nativeName: "Tiếng Việt",
		websiteReady: true,
	},
	"zh-TW": {
		code: "zh-TW",
		name: "Chinese (Traditional)",
		nativeName: "繁體中文",
		websiteReady: true,
	},
};

export const webLanguages = Object.values(languages).filter(
	(l) => l.websiteReady,
);

export const defaultLanguage: Language = languages["en"]!;
