import type { Ctx } from "../../ctx";
import { DbServer } from "../../db/types";
import { respondWith } from "../../utils";
import { getCommandName } from "../discordUtils";
import type { Currency } from "../i18n/currency";
import type { Language } from "../i18n/language";
import { freeCommand } from "./noGuildCommands/freeCommand";
import { helpCommand } from "./noGuildCommands/helpCommand";
import { upCommand } from "./noGuildCommands/upCommand";
import {
	isContextMenuApplicationCommandInteraction,
	isGuildInteraction,
} from "discord-api-types/utils/v10";
import {
	type APIApplicationCommandAutocompleteInteraction,
	type APIApplicationCommandInteraction,
	type APIChatInputApplicationCommandGuildInteraction,
	type APIChatInputApplicationCommandInteraction,
	type APIMessageComponentInteraction,
	type APIModalSubmitInteraction,
	InteractionType,
} from "discord-api-types/v10";

export type Command =
	| {
			requiresGuild: true;
			handler: (
				ctx: Ctx,
				i: APIChatInputApplicationCommandGuildInteraction,
				language: Language,
				currency: Currency,
				server: DbServer | null
			) => Promise<Response>;
	  }
	| {
			requiresGuild: false;
			handler: (
				ctx: Ctx,
				i: APIChatInputApplicationCommandInteraction,
				language: Language,
				currency: Currency,
				server?: never
			) => Promise<Response>;
	  };

const commands = new Map<string, Command>();

commands.set("/free", freeCommand);
commands.set("/up", upCommand);
commands.set("/help", helpCommand);

export async function commandHandler(
	ctx: Ctx,
	i:
		| APIMessageComponentInteraction
		| APIApplicationCommandAutocompleteInteraction
		| APIModalSubmitInteraction
		| APIApplicationCommandInteraction,
	language: Language,
	currency: Currency,
	dbServer: DbServer | null
) {
	if (i.type === InteractionType.ApplicationCommand) {
		if (isContextMenuApplicationCommandInteraction(i))
			return respondWith(400, "Invalid request");

		const commandName = getCommandName(i);

		const command = commands.get(commandName);

		if (!command) {
			ctx.logger.warn("Command not found", { commandName });
			return respondWith(400, "Invalid request");
		}

		if (command.requiresGuild) {
			if (!isGuildInteraction(i)) {
				ctx.logger.warn("Command requires guild, but wasn't ran in one", { commandName });
				return respondWith(400, "Invalid request");
			} else {
				const response = await command.handler(ctx, i, language, currency, dbServer);

				return response;
			}
		} else {
			const response = await command.handler(ctx, i, language, currency);

			return response;
		}
	}

	return respondWith(400, "Invalid request");
}
