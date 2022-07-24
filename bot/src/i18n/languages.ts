import { Currency, Language } from "../types.ts";

import af_commands from "./t10n/af/commands.json" assert { type: "json" };
import af from "./t10n/af/messages.json" assert { type: "json" };

import ar_commands from "./t10n/ar/commands.json" assert { type: "json" };
import ar from "./t10n/ar/messages.json" assert { type: "json" };

import bg_commands from "./t10n/bg/commands.json" assert { type: "json" };
import bg from "./t10n/bg/messages.json" assert { type: "json" };
import bg_old from "./t10n/bg/old-messages.json" assert { type: "json" };

import cs_commands from "./t10n/cs/commands.json" assert { type: "json" };
import cs from "./t10n/cs/messages.json" assert { type: "json" };
import cs_old from "./t10n/cs/old-messages.json" assert { type: "json" };

import de_commands from "./t10n/de/commands.json" assert { type: "json" };
import de from "./t10n/de/messages.json" assert { type: "json" };

import en_commands from "./t10n/en/commands.json" assert { type: "json" };
import en from "./t10n/en/messages.json" assert { type: "json" };

import es_commands from "./t10n/es/commands.json" assert { type: "json" };
import es from "./t10n/es/messages.json" assert { type: "json" };

import fa_commands from "./t10n/fa/commands.json" assert { type: "json" };
import fa from "./t10n/fa/messages.json" assert { type: "json" };
import fa_old from "./t10n/fa/old-messages.json" assert { type: "json" };

import fr_commands from "./t10n/fr/commands.json" assert { type: "json" };
import fr from "./t10n/fr/messages.json" assert { type: "json" };

import he_commands from "./t10n/he/commands.json" assert { type: "json" };
import he from "./t10n/he/messages.json" assert { type: "json" };

import hi_commands from "./t10n/hi/commands.json" assert { type: "json" };
import hi from "./t10n/hi/messages.json" assert { type: "json" };
import hi_old from "./t10n/hi/old-messages.json" assert { type: "json" };

import hu_commands from "./t10n/hu/commands.json" assert { type: "json" };
import hu from "./t10n/hu/messages.json" assert { type: "json" };

import id_commands from "./t10n/id/commands.json" assert { type: "json" };
import id from "./t10n/id/messages.json" assert { type: "json" };
import id_old from "./t10n/id/old-messages.json" assert { type: "json" };

import it_commands from "./t10n/it/commands.json" assert { type: "json" };
import it from "./t10n/it/messages.json" assert { type: "json" };
import it_old from "./t10n/it/old-messages.json" assert { type: "json" };

import ja_commands from "./t10n/ja/commands.json" assert { type: "json" };
import ja from "./t10n/ja/messages.json" assert { type: "json" };
import ja_old from "./t10n/ja/old-messages.json" assert { type: "json" };

import ka_commands from "./t10n/ka/commands.json" assert { type: "json" };
import ka from "./t10n/ka/messages.json" assert { type: "json" };
import ka_old from "./t10n/ka/old-messages.json" assert { type: "json" };

import ko_commands from "./t10n/ko/commands.json" assert { type: "json" };
import ko from "./t10n/ko/messages.json" assert { type: "json" };

import nl_commands from "./t10n/nl/commands.json" assert { type: "json" };
import nl from "./t10n/nl/messages.json" assert { type: "json" };
import nl_old from "./t10n/nl/old-messages.json" assert { type: "json" };

import pl_commands from "./t10n/pl/commands.json" assert { type: "json" };
import pl from "./t10n/pl/messages.json" assert { type: "json" };

import pt_commands from "./t10n/pt/commands.json" assert { type: "json" };
import pt from "./t10n/pt/messages.json" assert { type: "json" };
import pt_old from "./t10n/pt/old-messages.json" assert { type: "json" };

import ro_commands from "./t10n/ro/commands.json" assert { type: "json" };
import ro from "./t10n/ro/messages.json" assert { type: "json" };

import ru_commands from "./t10n/ru/commands.json" assert { type: "json" };
import ru from "./t10n/ru/messages.json" assert { type: "json" };
import ru_old from "./t10n/ru/old-messages.json" assert { type: "json" };

import tr_commands from "./t10n/tr/commands.json" assert { type: "json" };
import tr from "./t10n/tr/messages.json" assert { type: "json" };

import uk_commands from "./t10n/uk/commands.json" assert { type: "json" };
import uk from "./t10n/uk/messages.json" assert { type: "json" };
import uk_old from "./t10n/uk/old-messages.json" assert { type: "json" };

import vi_commands from "./t10n/vi/commands.json" assert { type: "json" };
import vi from "./t10n/vi/messages.json" assert { type: "json" };

export const languages = {
  af: {
    code: "af",
    englishName: "Afrikaans",
    nativeName: "Afrikaans",
  },
  ar: {
    code: "ar",
    englishName: "Arabic",
    nativeName: "عربي",
  },
  az: {
    code: "az",
    englishName: "Azerbaijani",
    nativeName: "آذربایجان دیلی‎",
  },
  bg: {
    code: "bg",
    englishName: "Bulgarian",
    nativeName: "български",
  },
  cs: {
    code: "cs",
    englishName: "Czech",
    nativeName: "čeština",
  },
  de: {
    code: "de",
    englishName: "German",
    nativeName: "Deutsch",
  },
  en: {
    code: "en",
    englishName: "English",
    nativeName: "English",
  },
  es: {
    code: "es",
    englishName: "Spanish",
    nativeName: "español",
  },
  fa: {
    code: "fa",
    englishName: "Persian",
    nativeName: "فارسی",
  },
  fr: {
    code: "fr",
    englishName: "French",
    nativeName: "français",
  },
  he: {
    code: "he",
    englishName: "Hebrew",
    nativeName: "עברית",
  },
  hi: {
    code: "hi",
    englishName: "Hindi",
    nativeName: "हिन्दी",
  },
  hu: {
    code: "hu",
    englishName: "Hungarian",
    nativeName: "magyar",
  },
  id: {
    code: "id",
    englishName: "Indonesian",
    nativeName: "Bahasa Indonesia",
  },
  it: {
    code: "it",
    englishName: "Italian",
    nativeName: "italiano",
  },
  ja: {
    code: "ja",
    englishName: "Japanese",
    nativeName: "日本語",
  },
  ka: {
    code: "ka",
    englishName: "Georgian",
    nativeName: "ქართული",
  },
  ko: {
    code: "ko",
    englishName: "Korean",
    nativeName: "한국어",
  },
  nl: {
    code: "nl",
    englishName: "Dutch",
    nativeName: "Nederlands",
  },
  pl: {
    code: "pl",
    englishName: "Polish",
    nativeName: "polski",
  },
  pt: {
    code: "pt",
    englishName: "Portuguese",
    nativeName: "português",
  },
  ro: {
    code: "ro",
    englishName: "Romanian",
    nativeName: "română",
  },
  ru: {
    code: "ru",
    englishName: "Russian",
    nativeName: "русский",
  },
  tr: {
    code: "tr",
    englishName: "Turkish",
    nativeName: "Türkçe",
  },
  uk: {
    code: "uk",
    englishName: "Ukrainian",
    nativeName: "українська",
  },
  vi: {
    code: "vi",
    englishName: "Vietnamese",
    nativeName: "Tiếng Việt",
  },
};

export const defaultLanguage: Language = languages["en"];
export const defaultCurrency: Currency = {
  code: "USD",
  afterPrice: " $",
  inFrontOfPrice: "",
  apiValue: "US",
  name: "$ Dollar (USD)",
};

export const translations: Map<string, unknown> = new Map([
  ["af", { ...af, ...af_commands }],
  ["ar", { ...ar, ...ar_commands }],
  ["bg", { ...bg, ...bg_commands, ...bg_old }],
  ["cs", { ...cs, ...cs_commands, ...cs_old }],
  ["de", { ...de, ...de_commands }],
  ["en", { ...en, ...en_commands }],
  ["es", { ...es, ...es_commands }],
  ["fa", { ...fa, ...fa_commands, ...fa_old }],
  ["fr", { ...fr, ...fr_commands }],
  ["he", { ...he, ...he_commands }],
  ["hi", { ...hi, ...hi_commands, ...hi_old }],
  ["hu", { ...hu, ...hu_commands }],
  ["id", { ...id, ...id_commands, ...id_old }],
  ["it", { ...it, ...it_commands, ...it_old }],
  ["ja", { ...ja, ...ja_commands, ...ja_old }],
  ["ka", { ...ka, ...ka_commands, ...ka_old }],
  ["ko", { ...ko, ...ko_commands }],
  ["nl", { ...nl, ...nl_commands, ...nl_old }],
  ["pl", { ...pl, ...pl_commands }],
  ["pt", { ...pt, ...pt_commands, ...pt_old }],
  ["ro", { ...ro, ...ro_commands }],
  ["ru", { ...ru, ...ru_commands, ...ru_old }],
  ["tr", { ...tr, ...tr_commands }],
  ["uk", { ...uk, ...uk_commands, ...uk_old }],
  ["vi", { ...vi, ...vi_commands }],
]);
