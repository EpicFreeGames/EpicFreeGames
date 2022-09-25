import { GetStaticProps } from "next";

import { defaultLanguage, languages, translations, webLanguages } from "@efg/i18n";
import type { ILanguage } from "@efg/types";

import { IEnvironment, environment } from "./envs";

export const mainGetStaticProps: GetStaticProps<{
  language: ILanguage;
  languages: ILanguage[];
  translations: Record<string, string>;
  env: IEnvironment;
}> = async ({ locale }) => {
  const language = languages.get(locale || defaultLanguage.code)!;

  return {
    props: {
      language,
      languages: [...webLanguages].map(([key, lang]) => lang),
      translations: translations.get(language.code)!,
      env: environment,
    },
  };
};
