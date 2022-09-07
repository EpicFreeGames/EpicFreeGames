import { GetStaticProps } from "next";

import { defaultLanguage, initTranslations, languages, translations } from "@efg/i18n";
import type { ILanguage } from "@efg/types";

import { IEnvironment, environment } from "./envs";

export const mainGetStaticProps: GetStaticProps<{
  language: ILanguage;
  translations: Record<string, string>;
  env: IEnvironment;
}> = async ({ locale }) => {
  if (!translations.size) await initTranslations();

  const language = languages.get(locale || defaultLanguage.code)!;

  return {
    props: {
      language,
      translations: translations.get(language.code)!,
      env: environment,
    },
  };
};
