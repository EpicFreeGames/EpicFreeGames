import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Command } from "../_commandType";
import { getTypedOption } from "../_getTypedOption";
import { setChannelSubCommand } from "./setChannelSubCommand";

export const setCommand: Command = {
	name: "set",
	needsGuild: true,
	needsManageGuild: true,
	handle: async (props) => {
		const subCommand = getTypedOption(props.i, ApplicationCommandOptionType.Subcommand);
		if (!subCommand) return;

		if (subCommand.name === "channel") {
			return setChannelSubCommand(props);
		}
	},
};
