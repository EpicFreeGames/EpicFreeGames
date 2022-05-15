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
    for (const key in english) {
      let translation = crowdinTranslations[lngCode][0].content[key];

      // if crowdin doesn't have a translation, use the old one
      if (translation === english[key]) {
        translation = old[lngCode][key];

        // if the old one doesn't exist, use the english one
        if (!translation) {
          translation = english[key];
        }
      }

      if (!resources[lngCode]) {
        resources[lngCode] = {};
      }

      resources[lngCode].translation = {
        [key]: translation,
      };
    }
  }

  for (const lang in resources) {
    const value = resources[lang].translation;

    if (value.invite === english.invite) {
      resources[lang].translation = {
        ...resources[lang].translation,
        footer: old[lang].translation.footer,
      };
    } else {
      resources[lang].translation = {
        ...resources[lang].translation,
        footer: createFooter(value.invite, value.vote, value.support, value.website),
      };
    }
  }

  await i18next.init({
    lng: "en",
    fallbackLng: "en",
    supportedLngs: crowdinLangs,
    resources,
    interpolation: {
      prefix: "<",
      suffix: ">",
    },
  });
};

export const translate2 = (key: string, language: Languages, vars?: any) => {
  const t = i18next.getFixedT(language);

  let translation = t(key, vars);

  return translation;
};

const createFooter = (invite: string, vote: string, support: string, website: string) => {
  const list = [invite, vote, support, website];
  const concatted = list.join("");
  const separator = " • ";

  if (concatted.length >= 39) {
    return list.slice(0, 2).join(separator) + "\n" + list.slice(1).join(separator);
  }

  return list.join(separator);
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
