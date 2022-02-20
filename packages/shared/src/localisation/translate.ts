import { isEnum } from "../utils";
import { Languages, Variables, Join, PathKeys } from "./types";
import { Translations, translations1 } from "./translations";
import { IGuild } from "../data/types";

export function translate<P extends Join<PathKeys<Translations>, ".">>(
  paths: P,
  vars?: Record<Variables<Translations, P, ".">, string>
) {
  const key = paths.split(".")[0] as keyof Translations;
  const language = paths.split(".")[1] as Languages;

  let translation = translations1[key][language];

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

export const getGuildLang = (guild: IGuild) => {
  let language: Languages = Languages.en;

  if (guild && guild.language) language = Languages[guild.language as keyof typeof Languages];

  if (isEnum<Languages>(guild.language)) language = guild.language;

  return language;
};
