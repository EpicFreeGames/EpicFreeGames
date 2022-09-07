import { configuration } from ".";
import { getBase64Image } from "./getBase64Image";

export const botConstants = {
  inviteGif:
    "https://media1.tenor.com/images/8be041fe538a0f292bb85885768341a7/tenor.gif?itemid=5261112",

  browserRedirect: (path: string) => `${configuration.EFG_FRONT_BASEURL}/r/browser${path}`,
  launcherRedirect: (path: string) => `${configuration.EFG_FRONT_BASEURL}/r/launcher${path}`,

  website: {
    home: `${configuration.EFG_FRONT_BASEURL}`,
    commands: `${configuration.EFG_FRONT_BASEURL}/commands`,
    tutorial: `${configuration.EFG_FRONT_BASEURL}/tutorial`,
    serverInvite: `https://discord.gg/49UQcJe`,
    botInvite: `${configuration.EFG_FRONT_BASEURL}/invite`,
  },

  voteLinks: {
    "Top.gg": "https://top.gg/bot/719806770133991434/vote",
    "Discordlist.gg": "https://discordlist.gg/bot/719806770133991434/vote",
  },

  botName: "EpicFreeGames",
  webhookName: "EpicFreeGames Notifications",
  base64Logo: async () => `data:image/png;base64,${await getBase64Image(configuration.LOGO_URL)}`,
};
