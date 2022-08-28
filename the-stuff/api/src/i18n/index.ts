import { readdir } from "node:fs/promises";
import { join } from "path";

import { defaultLanguage } from "./languages";

export const translations: Map<string, Record<string, string>> = new Map();

export const initTranslations = async () => {
  console.log("Loading translations...");

  const folders = await readdir(join(__dirname, "..", "..", "t10s"));

  for (const folder of folders) {
    const files = await readdir(join(__dirname, "..", "..", "t10s", folder));

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = join(__dirname, "..", "..", "t10s", folder, file);
        const fileContents = await import(filePath);

        translations.set(folder, {
          ...(translations.get(folder) ?? {}),
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
