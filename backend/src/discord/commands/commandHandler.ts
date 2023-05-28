import {
	isContextMenuApplicationCommandInteraction,
	isGuildInteraction,
} from "../../../node_modules/discord-api-types/utils/v10";
import { Ctx } from "../../ctx";
import { DbServer } from "../../db/types";
import { respondWith } from "../../utils";
import { getCommandName } from "../discordUtils";
import { Currency } from "../i18n/currency";
import { Language } from "../i18n/language";
import { gamesCommand } from "./adminCommands/gamesCommand";
import { freeCommand } from "./noGuildCommands/freeCommand";
import { helpCommand } from "./noGuildCommands/helpCommand";
import { inviteCommand } from "./noGuildCommands/inviteCommand";
import { upCommand } from "./noGuildCommands/upCommand";
import {
	APIApplicationCommandAutocompleteInteraction,
	APIApplicationCommandInteraction,
	APIChatInputApplicationCommandGuildInteraction,
	APIChatInputApplicationCommandInteraction,
	APIMessageComponentInteraction,
	APIModalSubmitInteraction,
	InteractionType,
} from "discord-api-types/v10";

export type Command =
	| {
			requiresGuild: true;
			handler: (
				ctx: Ctx,
				i: APIChatInputApplicationCommandGuildInteraction,
				/**
				 * Full command name (e.g. `/set channel`)
				 */
				commandName: string,
				language: Language,
				currency: Currency,
				server: DbServer | null
			) => Promise<Response | void>;
	  }
	| {
			requiresGuild: false;
			handler: (
				ctx: Ctx,
				i: APIChatInputApplicationCommandInteraction,
				/**
				 * Full command name (e.g. `/set channel`)
				 */
				commandName: string,
				language: Language,
				currency: Currency,
				server?: never
			) => Promise<Response | void>;
	  };

const commands = new Map<string, Command>();
const modalHandlers = new Map<
	string,
	(ctx: Ctx, i: APIModalSubmitInteraction) => Promise<Response | void>
>();

commands.set("/free", freeCommand);
commands.set("/up", upCommand);
commands.set("/help", helpCommand);
commands.set("/invite", inviteCommand);
commands.set("/games", gamesCommand);

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
		const baseCommand = commandName.split(" ")[0]!;

		const command = commands.get(baseCommand);

		if (!command) {
			ctx.log(`Command not found`, { n: commandName, n2: baseCommand });
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

				return await command.handler(ctx, i, commandName, language, currency, dbServer);
			}
		} else {
			ctx.log("Running command", {
				n: commandName,
				g: i.guild_id ?? null,
				u: i.member?.user.id || i.user?.id,
			});

			return await command.handler(ctx, i, commandName, language, currency);
		}
	} else if (i.type === InteractionType.ModalSubmit) {
		const modalCustomId = i.data.custom_id.split(":")[0]!;
		const modalHandler = modalHandlers.get(modalCustomId);

		if (!modalHandler) {
			ctx.log(`Modal handler not found`, { n: modalCustomId });
			return respondWith(ctx, 400, "Invalid request");
		}

		ctx.log("Running modal handler", { n: modalCustomId });

		return await modalHandler(ctx, i);
	}

	return respondWith(ctx, 400, "Invalid request");
}
