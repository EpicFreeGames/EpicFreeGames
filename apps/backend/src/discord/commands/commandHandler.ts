import {
	isContextMenuApplicationCommandInteraction,
	isGuildInteraction,
} from "discord-api-types/utils/v10";
import {
	type APIApplicationCommandAutocompleteInteraction,
	type APIApplicationCommandInteraction,
	type APIChatInputApplicationCommandDMInteraction,
	type APIChatInputApplicationCommandGuildInteraction,
	type APIChatInputApplicationCommandInteraction,
	type APIGuildInteraction,
	type APIMessageComponentInteraction,
	type APIModalSubmitInteraction,
	InteractionType,
} from "discord-api-types/v10";

import type { DbServer } from "@efg/db";

import type { Ctx } from "../../ctx";
import { getCommandName } from "../discordUtils";
import type { Currency } from "../i18n/currency";
import type { Language } from "../i18n/language";
import { freeCommand } from "./noGuildCommands/freeCommand";

export type Command =
	| {
			requiresGuild: true;
			handler: (
				ctx: Ctx,
				i: APIChatInputApplicationCommandGuildInteraction,
				language: Language,
				currency: Currency,
				server: DbServer | null
			) => Promise<void>;
	  }
	| {
			requiresGuild: false;
			handler: (
				ctx: Ctx,
				i: APIChatInputApplicationCommandInteraction,
				language: Language,
				currency: Currency,
				server?: never
			) => Promise<void>;
	  };

const commands = new Map<string, Command>();

commands.set("/free", freeCommand);

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
		if (isContextMenuApplicationCommandInteraction(i)) return;

		const commandName = getCommandName(i);

		const command = commands.get(commandName);

		if (!command) {
			ctx.logger.warn("Command not found", { commandName });
			return;
		}

		if (command.requiresGuild) {
			if (!isGuildInteraction(i)) {
				ctx.logger.warn("Command requires guild, but wasn't ran in one", { commandName });
				return;
			} else {
				await command.handler(ctx, i, language, currency, dbServer);
			}
		} else {
			await command.handler(ctx, i, language, currency);
		}
	}
}
