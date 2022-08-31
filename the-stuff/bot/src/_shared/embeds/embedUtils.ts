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

export const chars = {
  separator: "   •   ",
  arrow: "  ➜  ",
};

const createFooter = (language: Language) => {
  const invite = t({ language, key: "invite" });
  const support = t({ language, key: "support" });
  const website = t({ language, key: "website" });

  const list = [invite, support, website];
  const withVars = [
    utils.link(invite, botConstants.website.botInvite),
    utils.link(support, botConstants.website.serverInvite),
    utils.link(website, botConstants.website.home),
  ];

  const concatted = list.join(chars.separator);
  const threeConcatted = list.slice(0, 3).join(chars.separator);

  // if the footer is too long, try to break it,
  // otherwise, just use the full footer

  if (concatted.length >= 39)
    if (threeConcatted.length >= 39)
      // 2 lines, with one on the second line
      return (
        withVars.slice(0, 2).join(chars.separator) + "\n" + withVars.slice(2).join(chars.separator)
      );

  return withVars.join(chars.separator);
};
