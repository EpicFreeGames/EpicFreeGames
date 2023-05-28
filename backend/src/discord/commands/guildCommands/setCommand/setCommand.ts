import { Command } from "../../commandHandler";
import { setChannelSubCommand } from "./setChannelCommand";

export const setCommand: Command = {
	requiresGuild: true,
	handler: async (ctx, i, commandName, language, currency, server) => {
		const subCommand = commandName.split(" ")[1];

		if (subCommand === "channel") {
			return await setChannelSubCommand(ctx, i, commandName, language, currency, server);
		}
	},
};
