import { Currency, Language } from "../types.ts";

import af_commands from "./t10s/af/commands.json" assert { type: "json" };
import af from "./t10s/af/messages.json" assert { type: "json" };

import ar_commands from "./t10s/ar/commands.json" assert { type: "json" };
import ar from "./t10s/ar/messages.json" assert { type: "json" };

import bg_commands from "./t10s/bg/commands.json" assert { type: "json" };
import bg from "./t10s/bg/messages.json" assert { type: "json" };
import bg_old from "./t10s/bg/old-messages.json" assert { type: "json" };

import cs_commands from "./t10s/cs/commands.json" assert { type: "json" };
import cs from "./t10s/cs/messages.json" assert { type: "json" };
import cs_old from "./t10s/cs/old-messages.json" assert { type: "json" };

import de_commands from "./t10s/de/commands.json" assert { type: "json" };
import de from "./t10s/de/messages.json" assert { type: "json" };

import en_commands from "./t10s/en/commands.json" assert { type: "json" };
import en from "./t10s/en/messages.json" assert { type: "json" };

import es_commands from "./t10s/es/commands.json" assert { type: "json" };
import es from "./t10s/es/messages.json" assert { type: "json" };

import fa_commands from "./t10s/fa/commands.json" assert { type: "json" };
import fa from "./t10s/fa/messages.json" assert { type: "json" };
import fa_old from "./t10s/fa/old-messages.json" assert { type: "json" };

import fr_commands from "./t10s/fr/commands.json" assert { type: "json" };
import fr from "./t10s/fr/messages.json" assert { type: "json" };

import he_commands from "./t10s/he/commands.json" assert { type: "json" };
import he from "./t10s/he/messages.json" assert { type: "json" };

import hi_commands from "./t10s/hi/commands.json" assert { type: "json" };
import hi from "./t10s/hi/messages.json" assert { type: "json" };
import hi_old from "./t10s/hi/old-messages.json" assert { type: "json" };

import hu_commands from "./t10s/hu/commands.json" assert { type: "json" };
import hu from "./t10s/hu/messages.json" assert { type: "json" };

import id_commands from "./t10s/id/commands.json" assert { type: "json" };
import id from "./t10s/id/messages.json" assert { type: "json" };
import id_old from "./t10s/id/old-messages.json" assert { type: "json" };

import it_commands from "./t10s/it/commands.json" assert { type: "json" };
import it from "./t10s/it/messages.json" assert { type: "json" };
import it_old from "./t10s/it/old-messages.json" assert { type: "json" };

import ja_commands from "./t10s/ja/commands.json" assert { type: "json" };
import ja from "./t10s/ja/messages.json" assert { type: "json" };
import ja_old from "./t10s/ja/old-messages.json" assert { type: "json" };

import ka_commands from "./t10s/ka/commands.json" assert { type: "json" };
import ka from "./t10s/ka/messages.json" assert { type: "json" };
import ka_old from "./t10s/ka/old-messages.json" assert { type: "json" };

import ko_commands from "./t10s/ko/commands.json" assert { type: "json" };
import ko from "./t10s/ko/messages.json" assert { type: "json" };

import nl_commands from "./t10s/nl/commands.json" assert { type: "json" };
import nl from "./t10s/nl/messages.json" assert { type: "json" };
import nl_old from "./t10s/nl/old-messages.json" assert { type: "json" };

import pl_commands from "./t10s/pl/commands.json" assert { type: "json" };
import pl from "./t10s/pl/messages.json" assert { type: "json" };

import pt_commands from "./t10s/pt/commands.json" assert { type: "json" };
import pt from "./t10s/pt/messages.json" assert { type: "json" };
import pt_old from "./t10s/pt/old-messages.json" assert { type: "json" };

import ro_commands from "./t10s/ro/commands.json" assert { type: "json" };
import ro from "./t10s/ro/messages.json" assert { type: "json" };

import ru_commands from "./t10s/ru/commands.json" assert { type: "json" };
import ru from "./t10s/ru/messages.json" assert { type: "json" };
import ru_old from "./t10s/ru/old-messages.json" assert { type: "json" };

import tr_commands from "./t10s/tr/commands.json" assert { type: "json" };
import tr from "./t10s/tr/messages.json" assert { type: "json" };

import uk_commands from "./t10s/uk/commands.json" assert { type: "json" };
import uk from "./t10s/uk/messages.json" assert { type: "json" };
import uk_old from "./t10s/uk/old-messages.json" assert { type: "json" };

import vi_commands from "./t10s/vi/commands.json" assert { type: "json" };
import vi from "./t10s/vi/messages.json" assert { type: "json" };

export const languages = new Map<string, Language>([
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

export const defaultLanguage: Language = languages.get("en")!;
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
