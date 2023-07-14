import { botLogos } from "./botLogos";
import { envs, inProd } from "./env";

export const constants = {
	links: {
		botInvite: `${envs.FRONT_BASE}/invite`,
		serverInvite: "https://discord.gg/49UQcJe",
		frontHome: envs.FRONT_BASE,
		frontCommands: `${envs.FRONT_BASE}/commands`,
		frontTutorial: `${envs.FRONT_BASE}/tutorial`,
	},

	voteLinks: {
		"Top.gg": "https://top.gg/bot/719806770133991434/vote",
		"Discordlist.gg": "https://discordlist.gg/bot/719806770133991434/vote",
	},

	botName: inProd ? "EpicFreeGames" : `${envs.ENV} EpicFreeGames`,
	webhookName: inProd ? "EpicFreeGames Notifications" : `${envs.ENV} EpicFreeGames Notifications`,
	base64Logo: `data:image/png;base64,${botLogos[envs.ENV]}`,
};
