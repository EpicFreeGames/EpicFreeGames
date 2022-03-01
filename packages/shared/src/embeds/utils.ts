import { Languages, translate } from "../localisation";
import { constants } from "config";

export const utils = {
  footer: (language: Languages) =>
    "\n\n" +
    translate(`footer.${language}`, {
      inviteAddress: constants.links.botInvite,
      serverAddress: constants.links.serverInvite,
      voteAddress: constants.links.vote,
      website: constants.links.website,
    }),

  redirectToLauncher: (slug: string) =>
    `[Epic Games Launcher](${constants.links.launcherRedirect}${slug})`,

  redirectToBrowser: (slug: string) => `[Epicgames.com](${constants.links.browserRedirect}${slug})`,

  relativeTimestamp: (timestamp: number) => `<t:${timestamp}:R>`,

  strike: (text: any) => `~~${text}~~`,
  bold: (text: any) => `**${text}**`,
  title: (text: any) => `__** ${text} **__`,

  truncate: (text: any, length: number) =>
    text.length > length ? `${text.slice(0, length).trim()}...` : text,
};
