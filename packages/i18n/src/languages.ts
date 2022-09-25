import { ILanguage } from "@efg/types";

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
export const languages = new Map<string, ILanguage & { websiteReady: boolean }>([
  [
    "af",
    {
      code: "af",
      englishName: "Afrikaans",
      nativeName: "Afrikaans",
      websiteReady: true,
    },
  ],
  [
    "ar",
    {
      code: "ar",
      englishName: "Arabic",
      nativeName: "عربي",
      websiteReady: false,
    },
  ],
  [
    "az",
    {
      code: "az",
      englishName: "Azerbaijani",
      nativeName: "Azərbaycan",
      websiteReady: false,
    },
  ],
  [
    "bg",
    {
      code: "bg",
      englishName: "Bulgarian",
      nativeName: "Български",
      websiteReady: true,
    },
  ],
  [
    "cs",
    {
      code: "cs",
      englishName: "Czech",
      nativeName: "Čeština",
      websiteReady: false,
    },
  ],
  [
    "de",
    {
      code: "de",
      englishName: "German",
      nativeName: "Deutsch",
      websiteReady: false,
    },
  ],
  [
    "en",
    {
      code: "en",
      englishName: "English",
      nativeName: "English",
      websiteReady: true,
    },
  ],
  [
    "es-ES",
    {
      code: "es-ES",
      englishName: "Spanish",
      nativeName: "Español",
      websiteReady: true,
    },
  ],
  [
    "fa",
    {
      code: "fa",
      englishName: "Persian",
      nativeName: "فارسی",
      websiteReady: false,
    },
  ],
  [
    "fr",
    {
      code: "fr",
      englishName: "French",
      nativeName: "Français",
      websiteReady: false,
    },
  ],
  [
    "he",
    {
      code: "he",
      englishName: "Hebrew",
      nativeName: "עברית",
      websiteReady: false,
    },
  ],
  [
    "hi",
    {
      code: "hi",
      englishName: "Hindi",
      nativeName: "हिन्दी",
      websiteReady: false,
    },
  ],
  [
    "hu",
    {
      code: "hu",
      englishName: "Hungarian",
      nativeName: "Magyar",
      websiteReady: false,
    },
  ],
  [
    "id",
    {
      code: "id",
      englishName: "Indonesian",
      nativeName: "Bahasa Indonesia",
      websiteReady: false,
    },
  ],
  [
    "it",
    {
      code: "it",
      englishName: "Italian",
      nativeName: "Italiano",
      websiteReady: false,
    },
  ],
  [
    "ja",
    {
      code: "ja",
      englishName: "Japanese",
      nativeName: "日本語",
      websiteReady: false,
    },
  ],
  [
    "ka",
    {
      code: "ka",
      englishName: "Georgian",
      nativeName: "ქართული",
      websiteReady: false,
    },
  ],
  [
    "ko",
    {
      code: "ko",
      englishName: "Korean",
      nativeName: "한국어",
      websiteReady: false,
    },
  ],
  [
    "mk",
    {
      code: "mk",
      englishName: "Macedonian",
      nativeName: "Македонски",
      websiteReady: false,
    },
  ],
  [
    "nl",
    {
      code: "nl",
      englishName: "Dutch",
      nativeName: "Nederlands",
      websiteReady: false,
    },
  ],
  [
    "pl",
    {
      code: "pl",
      englishName: "Polish",
      nativeName: "Polski",
      websiteReady: true,
    },
  ],
  [
    "pt-BR",

    {
      code: "pt-BR",
      englishName: "Portuguese (Brazil)",
      nativeName: "Português (Brasil)",
      websiteReady: false,
    },
  ],
  [
    "pt-PT",

    {
      code: "pt-PT",
      englishName: "Portuguese (Portugal)",
      nativeName: "Português (Portugal)",
      websiteReady: false,
    },
  ],
  [
    "ro",
    {
      code: "ro",
      englishName: "Romanian",
      nativeName: "Română",
      websiteReady: false,
    },
  ],
  [
    "ru",
    {
      code: "ru",
      englishName: "Russian",
      nativeName: "Русский",
      websiteReady: false,
    },
  ],
  [
    "sr",
    {
      code: "sr",
      englishName: "Serbian",
      nativeName: "Српски",
      websiteReady: false,
    },
  ],
  [
    "sr-CS",
    {
      code: "sr-CS",
      englishName: "Serbian (Cyrillic)",
      nativeName: "Српски (Ћирилица)",
      websiteReady: false,
    },
  ],
  [
    "tr",
    {
      code: "tr",
      englishName: "Turkish",
      nativeName: "Türkçe",
      websiteReady: false,
    },
  ],
  [
    "uk",
    {
      code: "uk",
      englishName: "Ukrainian",
      nativeName: "Українська",
      websiteReady: false,
    },
  ],
  [
    "vi",
    {
      code: "vi",
      englishName: "Vietnamese",
      nativeName: "Tiếng Việt",
      websiteReady: true,
    },
  ],
  [
    "zh-TW",
    {
      code: "zh-TW",
      englishName: "Chinese (Traditional)",
      nativeName: "繁體中文",
      websiteReady: true,
    },
  ],
]);

export const webLanguages = [...languages].filter(([key, lang]) => lang.websiteReady);

export const defaultLanguage: ILanguage = languages.get("en")!;
