import { botLogos } from "./botLogos";
import { env, inProd } from "./env";

export const frontBase = `https://${inProd ? "" : "staging"}epicfreegames.net`;

export const constants = {
	links: {
		botInvite: `${frontBase}/invite`,
		serverInvite: "https://discord.gg/49UQcJe",
		frontHome: frontBase,
		frontCommands: `${frontBase}/commands`,
		frontTutorial: `${frontBase}/tutorial`,
	},

	voteLinks: {
		"Top.gg": "https://top.gg/bot/719806770133991434/vote",
		"Discordlist.gg": "https://discordlist.gg/bot/719806770133991434/vote",
	},

	botName: inProd ? "EpicFreeGames" : `${env.ENV} EpicFreeGames`,
	webhookName: inProd ? "EpicFreeGames Notifications" : `${env.ENV} EpicFreeGames Notifications`,
	base64Logo: `data:image/png;base64,${botLogos[env.ENV]}`,
};
