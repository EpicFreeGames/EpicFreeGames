import { GetStaticProps } from "next";
import { getDefaultLanguage, getLangauge } from "~languages";

import { ILanguage, Translations } from "~i18n/types";

import { apiBaseUrl, token } from "./envs";

type ApiResponse = {
  translations: Translations;
  usedDefaultTranslations: boolean;
};

export const mainGetStaticProps: GetStaticProps<{
  language: ILanguage;
  translations: Translations;
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
    },
  };
};
