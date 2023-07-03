import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Command } from "../_commandType";
import { getTypedOption } from "../_getTypedOption";
import { setCurrencySubCommand } from "./currency/setCurrencySubCommand";
import { setLanguageSubCommand } from "./language/setLanguageSubCommand";
import { setChannelSubCommand } from "./setChannelSubCommand";
import { setRoleSubCommand } from "./setRoleSubCommand";
import { setThreadSubCommand } from "./setThreadSubCommand";

export const setCommand: Command = {
	name: "set",
	needsGuild: true,
	needsManageGuild: true,
	handle: async (props) => {
		const subCommand = getTypedOption(props.i, ApplicationCommandOptionType.Subcommand);
		if (!subCommand) return props.ctx.respondWith(400, "No subcommand provided. (set)");

		if (subCommand.name === "channel") {
			return setChannelSubCommand(props);
		} else if (subCommand.name === "role") {
			return setRoleSubCommand(props);
		} else if (subCommand.name === "thread") {
			return setThreadSubCommand(props);
		} else if (subCommand.name === "language") {
			return setLanguageSubCommand(props);
		} else if (subCommand.name === "currency") {
			return setCurrencySubCommand(props);
		} else {
			return props.ctx.respondWith(400, `Unknown (set) subcommand: ${subCommand.name}`);
		}
	},
};
