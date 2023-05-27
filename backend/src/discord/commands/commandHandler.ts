import { Ctx } from "../../ctx";
import { DbServer } from "../../db/types";
import { respondWith } from "../../utils";
import { getCommandName } from "../discordUtils";
import { Currency } from "../i18n/currency";
import { Language } from "../i18n/language";
import { freeCommand } from "./noGuildCommands/freeCommand";
import { helpCommand } from "./noGuildCommands/helpCommand";
import { inviteCommand } from "./noGuildCommands/inviteCommand";
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
commands.set("/invite", inviteCommand);

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
			return respondWith(ctx, 400, "Invalid request");

		const commandName = getCommandName(i);

		const command = commands.get(commandName);

		if (!command) {
			ctx.log(`Command not found`, { n: commandName });
			return respondWith(ctx, 400, "Invalid request");
		}

		const isGuild = isGuildInteraction(i);

		if (command.requiresGuild) {
			if (!isGuild) {
				ctx.log(`Command requires guild, but wasn't ran in one`, { n: commandName });
				return respondWith(ctx, 400, "Invalid request");
			} else {
				ctx.log("Running command", {
					n: commandName,
					g: i.guild_id,
					u: i.member?.user.id || i.user?.id,
				});

				return await command.handler(ctx, i, language, currency, dbServer);
			}
		} else {
			ctx.log("Running command", {
				n: commandName,
				g: i.guild_id ?? null,
				u: i.member?.user.id || i.user?.id,
			});

			return await command.handler(ctx, i, language, currency);
		}
	}

	return respondWith(ctx, 400, "Invalid request");
}
