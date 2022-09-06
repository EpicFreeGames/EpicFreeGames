import { sharedConfig } from "./sharedConfig.ts";

export const botConstants = {
  inviteGif:
    "https://media1.tenor.com/images/8be041fe538a0f292bb85885768341a7/tenor.gif?itemid=5261112",

  browserRedirect: (path: string) => `${sharedConfig.EFG_FRONT_BASEURL}/r/browser${path}`,
  launcherRedirect: (path: string) => `${sharedConfig.EFG_FRONT_BASEURL}/r/launcher${path}`,

  website: {
    home: `${sharedConfig.EFG_FRONT_BASEURL}`,
    commands: `${sharedConfig.EFG_FRONT_BASEURL}/commands`,
    tutorial: `${sharedConfig.EFG_FRONT_BASEURL}/tutorial`,
    serverInvite: `https://discord.gg/49UQcJe`,
    botInvite: `${sharedConfig.EFG_FRONT_BASEURL}/invite`,
  },

  voteLinks: {
    "Top.gg": "https://top.gg/bot/719806770133991434/vote",
    "Discordlist.gg": "https://discordlist.gg/bot/719806770133991434/vote",
  },
};
