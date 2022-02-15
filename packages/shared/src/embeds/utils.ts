import { Languages } from "../localisation/languages";
import { translate } from "../localisation";
import { constants } from "config";

export const utils = {
  footer: (language: Languages) =>
    "\n\n" +
    translate("promotion_footer", language, {
      inviteAddress: constants.links.botInvite,
      serverAddress: constants.links.serverInvite,
      voteAddress: constants.links.vote,
      website: constants.links.website,
    }),

  redirectToLauncher: (language: Languages, slug: string) =>
    `[${translate("game_link_app", language)}](${constants.links.launcherRedirect}${slug})`,

  redirectToBrowser: (language: Languages, slug: string) =>
    `[${translate("game_link_browser", language)}](${constants.links.browserRedirect}${slug})`,

  relativeTimestamp: (timestamp: number) => `<t:${timestamp}:R>`,

  strike: (text: string) => `~~${text}~~`,

  truncate: (text: string, length: number) =>
    text.length > length ? `${text.slice(0, length).trim()}...` : text,
};
