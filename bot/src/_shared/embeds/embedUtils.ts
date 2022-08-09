import { botConstants } from "../constants.ts";
import { t } from "../i18n/translate.ts";
import { Language } from "../types.ts";

export const utils = {
  footer: (language: Language) => "\n\n" + createFooter(language),

  link: (text: string, url: string) => `[${text}](${url})`,

  relativeTimestamp: (timestamp: number) => `<t:${timestamp}:R>`,
  longTime: (timestamp: number) => `<t:${timestamp}:T>`,

  strike: (text: string) => `~~${text}~~`,
  bold: (text: string) => `**${text}**`,
  title: (text: string) => `__** ${text} **__`,
};

export const colors = {
  green: 0x008000,
  red: 0xce3e3e,
  blue: 0x3f3fff,
  white: 0xffffff,
  gray: 0x2f3136,
};

const createFooter = (language: Language) => {
  const invite = t({ language, key: "invite" });
  const support = t({ language, key: "support" });
  const website = t({ language, key: "website" });

  const list = [invite, support, website];
  const withVars = [
    `[${invite}](${botConstants.botInvite})`,
    `[${support}](${botConstants.serverInvite})`,
    `[${website}](${botConstants.website})`,
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

  return withVars.join(separator);
};
