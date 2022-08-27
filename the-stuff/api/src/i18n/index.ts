import { defaultLanguage } from "./languages";
import af_commands from "./t10s/af/commands.json";
import af from "./t10s/af/messages.json";
import ar_commands from "./t10s/ar/commands.json";
import ar from "./t10s/ar/messages.json";
import bg_commands from "./t10s/bg/commands.json";
import bg from "./t10s/bg/messages.json";
import cs_commands from "./t10s/cs/commands.json";
import cs from "./t10s/cs/messages.json";
import de_commands from "./t10s/de/commands.json";
import de from "./t10s/de/messages.json";
import en_commands from "./t10s/en/commands.json";
import en from "./t10s/en/messages.json";
import es_commands from "./t10s/es/commands.json";
import es from "./t10s/es/messages.json";
import fa_commands from "./t10s/fa/commands.json";
import fa from "./t10s/fa/messages.json";
import fr_commands from "./t10s/fr/commands.json";
import fr from "./t10s/fr/messages.json";
import he_commands from "./t10s/he/commands.json";
import he from "./t10s/he/messages.json";
import hi_commands from "./t10s/hi/commands.json";
import hi from "./t10s/hi/messages.json";
import hu_commands from "./t10s/hu/commands.json";
import hu from "./t10s/hu/messages.json";
import id_commands from "./t10s/id/commands.json";
import id from "./t10s/id/messages.json";
import it_commands from "./t10s/it/commands.json";
import it from "./t10s/it/messages.json";
import ja_commands from "./t10s/ja/commands.json";
import ja from "./t10s/ja/messages.json";
import ka_commands from "./t10s/ka/commands.json";
import ka from "./t10s/ka/messages.json";
import ko_commands from "./t10s/ko/commands.json";
import ko from "./t10s/ko/messages.json";
import nl_commands from "./t10s/nl/commands.json";
import nl from "./t10s/nl/messages.json";
import pl_commands from "./t10s/pl/commands.json";
import pl from "./t10s/pl/messages.json";
import pt_commands from "./t10s/pt/commands.json";
import pt from "./t10s/pt/messages.json";
import ro_commands from "./t10s/ro/commands.json";
import ro from "./t10s/ro/messages.json";
import ru_commands from "./t10s/ru/commands.json";
import ru from "./t10s/ru/messages.json";
import tr_commands from "./t10s/tr/commands.json";
import tr from "./t10s/tr/messages.json";
import uk_commands from "./t10s/uk/commands.json";
import uk from "./t10s/uk/messages.json";
import vi_commands from "./t10s/vi/commands.json";
import vi from "./t10s/vi/messages.json";

export const translations: Map<string, unknown> = new Map([
  ["af", { ...af, ...af_commands }],
  ["ar", { ...ar, ...ar_commands }],
  ["bg", { ...bg, ...bg_commands }],
  ["cs", { ...cs, ...cs_commands }],
  ["de", { ...de, ...de_commands }],
  ["en", { ...en, ...en_commands }],
  ["es", { ...es, ...es_commands }],
  ["fa", { ...fa, ...fa_commands }],
  ["fr", { ...fr, ...fr_commands }],
  ["he", { ...he, ...he_commands }],
  ["hi", { ...hi, ...hi_commands }],
  ["hu", { ...hu, ...hu_commands }],
  ["id", { ...id, ...id_commands }],
  ["it", { ...it, ...it_commands }],
  ["ja", { ...ja, ...ja_commands }],
  ["ka", { ...ka, ...ka_commands }],
  ["ko", { ...ko, ...ko_commands }],
  ["nl", { ...nl, ...nl_commands }],
  ["pl", { ...pl, ...pl_commands }],
  ["pt", { ...pt, ...pt_commands }],
  ["ro", { ...ro, ...ro_commands }],
  ["ru", { ...ru, ...ru_commands }],
  ["tr", { ...tr, ...tr_commands }],
  ["uk", { ...uk, ...uk_commands }],
  ["vi", { ...vi, ...vi_commands }],
]);

export const defaultTransations = translations.get(defaultLanguage.code)!;
