import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Command } from "../_commandType";
import { getTypedOption } from "../_getTypedOption";
import { removeChannelCommand } from "./removeChannelCommand";
import { removeRoleCommand } from "./removeRoleCommand";

export const removeCommand: Command = {
	name: "remove",
	needsGuild: true,
	needsManageGuild: true,
	handle: async (props) => {
		const subCommand = getTypedOption(props.i, ApplicationCommandOptionType.Subcommand);
		if (!subCommand) return props.ctx.respondWith(400, "No subcommand provided. (remove)");

		if (subCommand.name === "channel") {
			return removeChannelCommand(props);
		} else if (subCommand.name === "role") {
			return removeRoleCommand(props);
		} else {
			return props.ctx.respondWith(400, `Unknown (remove) subcommand: ${subCommand.name}`);
		}
	},
};
