import { sharedConfig } from "./sharedConfig.ts";

export const botConstants = {
  inviteGif:
    "https://media1.tenor.com/images/8be041fe538a0f292bb85885768341a7/tenor.gif?itemid=5261112",

  browserRedirect: (path: string) => `https://epicfreegames.net/r/browser/${path}`,
  launcherRedirect: (path: string) => `https://epicfreegames.net/r/launcher/${path}`,

  website: {
    home: "https://epicfreegames.net",
    commands: "https://epicfreegames.net/commands",
    tutorial: "https://epicfreegames.net/tutorial",
    serverInvite: "https://discord.gg/49UQcJe",
    botInvite: "https://epicfreegames.net/invite",
  },

  voteLinks: {
    "Top.gg": "https://top.gg/bot/719806770133991434/vote",
    "Discordlist.gg": "https://discordlist.gg/bot/719806770133991434/vote",
  },

  emojis: {
    questionMark: `${sharedConfig.EFG_FRONT_BASEURL}/assets/images/emojis/question-mark.png`,
  },
};
