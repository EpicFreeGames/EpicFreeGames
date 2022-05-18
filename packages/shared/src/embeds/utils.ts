import { t } from "../localisation";
import { constants } from "config";
import { ILanguage } from "../data/types";

export const utils = {
  footer: (language: ILanguage) =>
    "\n\n" +
    t("footer", language, {
      inviteAddress: constants.links.botInvite,
      serverAddress: constants.links.serverInvite,
      voteAddress: constants.links.vote,
      website: constants.links.website,
    }),

  link: (text: any, url: string) => `[${text}](${url})`,

  relativeTimestamp: (timestamp: number) => `<t:${timestamp}:R>`,
  longTime: (timestamp: number) => `<t:${timestamp}:T>`,

  strike: (text: any) => `~~${text}~~`,
  bold: (text: any) => `**${text}**`,
  title: (text: any) => `__** ${text} **__`,

  truncate: (text: any, length: number) =>
    text.length > length ? `${text.slice(0, length).trim()}...` : text,
};
