import { GetStaticProps } from "next";

import { ILanguage, Translations } from "~i18n/types";
import { getDefaultLanguage, getLangauge } from "~languages";

import { IEnvironment, apiBaseUrl, environment, token } from "./envs";

type ApiResponse = {
  translations: Translations;
  usedDefaultTranslations: boolean;
};

export const mainGetStaticProps: GetStaticProps<{
  language: ILanguage;
  translations: Translations;
  env: IEnvironment;
}> = async ({ locale }) => {
  const language = getLangauge(locale) ?? getDefaultLanguage();
  const response = await fetch(`${apiBaseUrl}/i18n/translations/${language.code}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();

  const translations = (json as ApiResponse).translations;

  return {
    props: {
      language,
      translations,
      env: environment,
    },
  };
};
