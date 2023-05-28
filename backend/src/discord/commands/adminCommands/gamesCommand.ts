import { env } from "../../../configuration/env";
import { createInteractionResponse } from "../../discordUtils";
import { botAdminOnlyCommandError } from "../../embeds/errors";
import { Command } from "../commandHandler";
import { gamesAddSubCommand } from "./games/gamesAddSubCommand";
import { gamesEditSubCommand } from "./games/gamesEditSubCommand";
import { gamesGetOneSubCommand } from "./games/gamesGetOneSubCommand";
import { gamesGetSubCommand } from "./games/gamesGetSubCommand";
import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";

export const gamesCommand: Command = {
	requiresGuild: true,
	async handler(ctx, i, commandName, language, currency, server) {
		if (i.member?.user?.id !== env.DC_ADMIN_ID) {
			return createInteractionResponse({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					flags: MessageFlags.Ephemeral,
					embeds: [botAdminOnlyCommandError(language)],
				},
			});
		}

		const subCommand = commandName.split(" ")[1];

		if (subCommand === "add") {
			return gamesAddSubCommand(ctx, i, commandName, language, currency, server);
		} else if (subCommand === "edit") {
			return gamesEditSubCommand(ctx, i);
		} else if (subCommand === "get") {
			return gamesGetSubCommand(ctx, i);
		} else if (subCommand === "get-one") {
			return gamesGetOneSubCommand(ctx, i);
		}

		return createInteractionResponse({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { content: "Not implemented yet" },
		});
	},
};
