import { ILanguage } from "./types";

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
export const languages = new Map<string, ILanguage>([
  ["af", { code: "af", englishName: "Afrikaans", nativeName: "Afrikaans" }],
  ["ar", { code: "ar", englishName: "Arabic", nativeName: "عربي" }],
  ["bg", { code: "bg", englishName: "Bulgarian", nativeName: "Български" }],
  ["cs", { code: "cs", englishName: "Czech", nativeName: "Čeština" }],
  ["de", { code: "de", englishName: "German", nativeName: "Deutsch" }],
  ["en", { code: "en", englishName: "English", nativeName: "English" }],
  ["es", { code: "es", englishName: "Spanish", nativeName: "Español" }],
  ["fa", { code: "fa", englishName: "Persian", nativeName: "فارسی" }],
  ["fr", { code: "fr", englishName: "French", nativeName: "Français" }],
  ["he", { code: "he", englishName: "Hebrew", nativeName: "עברית" }],
  ["hi", { code: "hi", englishName: "Hindi", nativeName: "हिन्दी" }],
  ["hu", { code: "hu", englishName: "Hungarian", nativeName: "Magyar" }],
  ["id", { code: "id", englishName: "Indonesian", nativeName: "Bahasa Indonesia" }],
  ["it", { code: "it", englishName: "Italian", nativeName: "Italiano" }],
  ["ja", { code: "ja", englishName: "Japanese", nativeName: "日本語" }],
  ["ka", { code: "ka", englishName: "Georgian", nativeName: "ქართული" }],
  ["ko", { code: "ko", englishName: "Korean", nativeName: "한국어" }],
  ["nl", { code: "nl", englishName: "Dutch", nativeName: "Nederlands" }],
  ["pl", { code: "pl", englishName: "Polish", nativeName: "Polski" }],
  ["pt", { code: "pt", englishName: "Portuguese", nativeName: "Português" }],
  ["ro", { code: "ro", englishName: "Romanian", nativeName: "Română" }],
  ["ru", { code: "ru", englishName: "Russian", nativeName: "Русский" }],
  ["tr", { code: "tr", englishName: "Turkish", nativeName: "Türkçe" }],
  ["uk", { code: "uk", englishName: "Ukrainian", nativeName: "Українська" }],
  ["vi", { code: "vi", englishName: "Vietnamese", nativeName: "Tiếng Việt" }],
]);

export const defaultLanguage: ILanguage = languages.get("en")!;
