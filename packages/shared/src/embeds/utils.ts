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

  strike: (text: string) => `~~${text}~~`,
  bold: (text: string) => `**${text}**`,
  title: (text: string) => `**__${text}__**`,

  truncate: (text: string, length: number) =>
    text.length > length ? `${text.slice(0, length).trim()}...` : text,
};
