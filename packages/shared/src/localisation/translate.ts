import { config } from "config";
import OtaClient from "@crowdin/ota-client";
import i18next from "i18next";

import english from "./english.json";
import old from "./old.json";
import { ILanguage } from "../data/types";

export const initTranslations = async () => {
  const client = new OtaClient(config.crowdinDistHash);

  const crowdinTranslations = await client.getTranslations();
  const resources: any = {
    en: {
      translation: english,
    },
  };

  for (const lngCode in crowdinTranslations) {
    if (lngCode === "en") continue;

    let lang = lngCode.slice(0, 2); // es-ES -> es

    for (const key in english) {
      let translation = crowdinTranslations[lngCode][0].content[key];

      // if crowdin doesn't have a translation, use the old one
      if (translation === (english as any)[key]) {
        translation = (old as any)[lang]?.translation[key];

        // if the old one doesn't exist, use the english one
        if (!translation) {
          translation = (english as any)[key];
        }
      }

      if (!resources[lang]?.translation) {
        resources[lang] = {
          translation: {},
        };
      }

      resources[lang].translation = {
        ...resources[lang].translation,
        [key]: translation,
      };
    }
  }

  for (const lang in resources) {
    const value = resources[lang].translation;
    console.log("value", value);
    console.log("thing", (old as any)[lang]);
    console.log("lang", lang);

    if (value.invite === english.invite) {
      resources[lang].translation = {
        ...resources[lang].translation,
        footer: (old as any)[lang].translation.footer,
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
    resources,
  });
};

export const t = (key: string, language: ILanguage, vars?: any) => {
  const t = i18next.getFixedT(language.code);

  const withoutVars = t(key);

  if (!vars) return withoutVars;

  let toReturn = withoutVars;

  for (const variable of Object.keys(vars)) {
    toReturn = toReturn.replace(`<${variable}>`, vars[variable]);
  }

  return toReturn;
};

const createFooter = (invite: string, vote: string, support: string, website: string) => {
  const list = [invite, vote, support, website];
  const withVars = [
    `[${invite}](<inviteAddress>)`,
    `[${vote}](<voteAddress>)`,
    `[${support}](<serverAddress>)`,
    `[${website}](<website>)`,
  ];
  const separator = " • ";
  const concatted = list.join(separator);
  const threeConcatted = list.slice(0, 3).join(separator);

  // if the footer is too long, try to break it,
  // otherwise, just use the full footer

  if (concatted.length >= 39)
    if (threeConcatted.length >= 39)
      // 2 lines, with one on the second line
      return withVars.slice(0, 2).join(separator) + "\n" + withVars.slice(2).join(separator);
    // 2 lines, with two on the second line
    else return withVars.slice(0, 3).join(separator) + "\n" + withVars.slice(3).join(separator);

  return withVars.join(separator);
};
