import { IGuild } from "../data/types";
import { isEnum } from "../utils";
import { translations } from "./translations";
import { Languages } from "./languages";

const defaultLang = Languages.en;

export const translate = (key: string, lan: Languages, variables: any = {}) => {
  const lang = lan || defaultLang;

  const translationsByLanguage = translations[key];
  if (!translationsByLanguage) return "NO TRANSLATION";

  let translation = translationsByLanguage[lang];

  if (Object.keys(variables).length > 0) {
    Object.keys(variables).forEach((variable) => {
      translation = translation.replace(`{${variable}}`, variables[variable]);
    });
  }

  return translation;
};

export const getGuildLang = (guild: IGuild) => {
  let language: Languages = Languages.en;

  if (guild && guild.language) language = Languages[guild.language as keyof typeof Languages];

  if (isEnum<Languages>(guild.language)) language = guild.language;

  return language;
};
