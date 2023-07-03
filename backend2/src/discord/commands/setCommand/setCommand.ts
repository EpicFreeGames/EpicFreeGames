import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Command } from "../_commandType";
import { getTypedOption } from "../_getTypedOption";
import { setChannelSubCommand } from "./setChannelSubCommand";
import { setRoleSubCommand } from "./setRoleSubCommand";
import { setThreadSubCommand } from "./setThreadSubCommand";

export const setCommand: Command = {
	name: "set",
	needsGuild: true,
	needsManageGuild: true,
	handle: async (props) => {
		const subCommand = getTypedOption(props.i, ApplicationCommandOptionType.Subcommand);
		if (!subCommand) return;

		if (subCommand.name === "channel") {
			return setChannelSubCommand(props);
		} else if (subCommand.name === "role") {
			return setRoleSubCommand(props);
		} else if (subCommand.name === "thread") {
			return setThreadSubCommand(props);
		}
	},
};
