export type Language = {
	code: string;
	name: string;
	englishName: string;
	websiteReady: boolean;
};

export const defaultLangauge = {
	code: "en",
	name: "English",
	englishName: "English",
	websiteReady: true,
};

export const languages = new Map<string, Language & { websiteReady: boolean }>([
	[
		"af",
		{
			code: "af",
			name: "Afrikaans",
			englishName: "Afrikaans",
			websiteReady: true,
		},
	],
	[
		"ar",
		{
			code: "ar",
			name: "عربي",
			englishName: "Arabic",
			websiteReady: false,
		},
	],
	[
		"az",
		{
			code: "az",
			name: "Azərbaycan",
			englishName: "Azerbaijani",
			websiteReady: false,
		},
	],
	[
		"bg",
		{
			code: "bg",
			name: "Български",
			englishName: "Bulgarian",
			websiteReady: true,
		},
	],
	[
		"cs",
		{
			code: "cs",
			name: "Čeština",
			englishName: "Czech",
			websiteReady: false,
		},
	],
	[
		"de",
		{
			code: "de",
			name: "Deutsch",
			englishName: "German",
			websiteReady: true,
		},
	],
	[defaultLangauge.code, defaultLangauge],
	[
		"es-ES",
		{
			code: "es-ES",
			name: "Español",
			englishName: "Spanish",
			websiteReady: true,
		},
	],
	[
		"fa",
		{
			code: "fa",
			name: "فارسی",
			englishName: "Persian",
			websiteReady: false,
		},
	],
	[
		"fr",
		{
			code: "fr",
			name: "Français",
			englishName: "French",
			websiteReady: false,
		},
	],
	[
		"he",
		{
			code: "he",
			name: "עברית",
			englishName: "Hebrew",
			websiteReady: false,
		},
	],
	[
		"hi",
		{
			code: "hi",
			name: "हिन्दी",
			englishName: "Hindi",
			websiteReady: false,
		},
	],
	[
		"hu",
		{
			code: "hu",
			name: "Magyar",
			englishName: "Hungarian",
			websiteReady: false,
		},
	],
	[
		"id",
		{
			code: "id",
			name: "Bahasa Indonesia",
			englishName: "Indonesian",
			websiteReady: true,
		},
	],
	[
		"it",
		{
			code: "it",
			name: "Italiano",
			englishName: "Italian",
			websiteReady: false,
		},
	],
	[
		"ja",
		{
			code: "ja",
			name: "日本語",
			englishName: "Japanese",
			websiteReady: false,
		},
	],
	[
		"ka",
		{
			code: "ka",
			name: "ქართული",
			englishName: "Georgian",
			websiteReady: false,
		},
	],
	[
		"ko",
		{
			code: "ko",
			name: "한국어",
			englishName: "Korean",
			websiteReady: true,
		},
	],
	[
		"mk",
		{
			code: "mk",
			name: "Македонски",
			englishName: "Macedonian",
			websiteReady: false,
		},
	],
	[
		"nl",
		{
			code: "nl",
			name: "Nederlands",
			englishName: "Dutch",
			websiteReady: false,
		},
	],
	[
		"pl",
		{
			code: "pl",
			name: "Polski",
			englishName: "Polish",
			websiteReady: true,
		},
	],
	[
		"pt-BR",

		{
			code: "pt-BR",
			name: "Português (Brasil)",
			englishName: "Portuguese (Brazil)",
			websiteReady: true,
		},
	],
	[
		"pt-PT",

		{
			code: "pt-PT",
			name: "Português (Portugal)",
			englishName: "Portuguese (Portugal)",
			websiteReady: false,
		},
	],
	[
		"ro",
		{
			code: "ro",
			name: "Română",
			englishName: "Romanian",
			websiteReady: false,
		},
	],
	[
		"ru",
		{
			code: "ru",
			name: "Русский",
			englishName: "Russian",
			websiteReady: true,
		},
	],
	[
		"sr",
		{
			code: "sr",
			name: "Српски",
			englishName: "Serbian",
			websiteReady: false,
		},
	],
	[
		"sr-CS",
		{
			code: "sr-CS",
			name: "Српски (Ћирилица)",
			englishName: "Serbian (Cyrillic)",
			websiteReady: false,
		},
	],
	[
		"tr",
		{
			code: "tr",
			name: "Türkçe",
			englishName: "Turkish",
			websiteReady: true,
		},
	],
	[
		"uk",
		{
			code: "uk",
			name: "Українська",
			englishName: "Ukrainian",
			websiteReady: true,
		},
	],
	[
		"vi",
		{
			code: "vi",
			name: "Tiếng Việt",
			englishName: "Vietnamese",
			websiteReady: true,
		},
	],
	[
		"zh-TW",
		{
			code: "zh-TW",
			englishName: "Chinese (Traditional)",
			name: "繁體中文",
			websiteReady: true,
		},
	],
]);
