import { readdir } from "node:fs/promises";
import { join } from "path";

import { defaultLanguage } from "./languages";

export const translations: Map<string, Record<string, string>> = new Map();

export const initTranslations = async () => {
  console.log("Loading translations...");

  const t10sPath = join(__dirname, "..", "t10s");

  const locales = await readdir(t10sPath);

  for (const locale of locales) {
    const files = await readdir(join(t10sPath, locale));

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = join(t10sPath, locale, file);
        const fileContents = await import(filePath);

        translations.set(locale, {
          ...(translations.get(locale) ?? {}),
          ...fileContents,
        });
      }
    }
  }

  [...translations].map(([languageCode, langTranslations]) => {
    const newTranslations = langTranslations;

    delete newTranslations.default;

    translations.set(languageCode, newTranslations);
  });

  console.log("Translations loaded");
};

export const getDefaultTransations = () => translations.get(defaultLanguage.code)!;
