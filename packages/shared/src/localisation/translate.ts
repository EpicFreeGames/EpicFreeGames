import { getJson, isEnum } from "../utils";
import { Languages, Variables, Join, PathKeys, Currencies } from "./types";
import { Translations, translations } from "./translations";
import { IGuild } from "../data/types";
import { config } from "config";
import OtaClient from "@crowdin/ota-client";
import i18next from "i18next";

export function translate<P extends Join<PathKeys<Translations>, ".">>(
  paths: P,
  vars?: Record<Variables<Translations, P, ".">, string>
) {
  const key = paths.split(".")[0] as keyof Translations;
  const language = paths.split(".")[1] as Languages;

  let translation = translations[key][language];

  if (!vars) return translation;

  let toReturn: string = translation;

  for (const variable of Object.keys(vars)) {
    toReturn = toReturn.replace(
      `{${variable}}`,
      vars[variable as keyof Record<Variables<Translations, P, ".">, string>]
    );
  }

  return toReturn;
}

export const initTranslations = async () => {
  const client = new OtaClient(config.crowdinDistHash);

  const english = await getJson("./english.json");
  const old = await getJson("./old.json");

  const crowdinLangs = await client.listLanguages();
  const crowdinTranslations = await client.getTranslations();
  const resources: any = {};

  for (const lngCode in crowdinTranslations) {
    for (const key in crowdinTranslations[lngCode][0].content) {
      let translation = crowdinTranslations[lngCode][0].content[key];

      // if crowdin doesn't have a translation, use the old one
      if (translation === english[key]) {
        translation = old[lngCode][key];
      }

      if (!resources[lngCode]) {
        resources[lngCode] = {};
      }

      resources[lngCode][key] = translation;
    }
  }

  await i18next.init({
    lng: "en",
    fallbackLng: "en",
    supportedLngs: crowdinLangs,
    resources,
  });
};

export const getGuildLang = (guild: IGuild) => {
  let language: Languages = Languages.en;

  if (guild && guild.language) language = Languages[guild.language];

  if (isEnum<Languages>(guild.language)) language = guild.language;

  return language;
};

export const getGuildCurrency = (guild: IGuild) => {
  let currency: Currencies = Currencies.USD;

  if (guild && guild.currency) currency = Currencies[guild.currency];

  if (isEnum<Currencies>(guild.currency)) currency = guild.currency;

  return currency;
};
