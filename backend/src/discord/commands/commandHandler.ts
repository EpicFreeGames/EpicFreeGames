import {
	isContextMenuApplicationCommandInteraction,
	isGuildInteraction,
} from "../../../node_modules/discord-api-types/utils/v10";
import { Ctx } from "../../ctx";
import { DbServer } from "../../db/types";
import { respondWith } from "../../utils";
import { createInteractionResponse, getCommandName } from "../discordUtils";
import { genericErrorEmbed } from "../embeds/errors";
import { Currency, currencies, defaultCurrency } from "../i18n/currency";
import { Language, defaultLangauge, languages } from "../i18n/language";
import { gamesCommand } from "./adminCommands/gamesCommand";
import { setCommand } from "./guildCommands/setCommand/setCommand";
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
	InteractionResponseType,
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

commands.set("/free", freeCommand);
commands.set("/up", upCommand);
commands.set("/help", helpCommand);
commands.set("/invite", inviteCommand);
commands.set("/games", gamesCommand);
commands.set("/set", setCommand);

export async function commandHandler(
	ctx: Ctx,
	i:
		| APIMessageComponentInteraction
		| APIApplicationCommandAutocompleteInteraction
		| APIModalSubmitInteraction
		| APIApplicationCommandInteraction
) {
	if (i.type === InteractionType.ApplicationCommand) {
		if (isContextMenuApplicationCommandInteraction(i))
			return respondWith(ctx, 400, "Invalid request");

		const commandName = getCommandName(i);
		const baseCommand = commandName.split(" ")[0]!;

		const command = commands.get(baseCommand);

		if (!command) {
			ctx.log(`Command not found`, { n: commandName, n2: baseCommand });
			return createInteractionResponse({
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					embeds: [
						genericErrorEmbed({ language: defaultLangauge, requestId: ctx.requestId }),
					],
				},
			});
		}

		const isGuild = isGuildInteraction(i);

		let dbServer: DbServer | null = null;
		let language: Language = defaultLangauge;
		let currency: Currency = defaultCurrency;

		if (isGuild) {
			dbServer = await ctx.db.servers.findOne({ id: i.guild_id });
			if (dbServer) {
				language = languages.get(dbServer.languageCode) || defaultLangauge;
				currency = currencies.get(dbServer.currencyCode) || defaultCurrency;
			}
		}

		if (command.requiresGuild) {
			if (!isGuild) {
				ctx.log(`Command requires guild, but wasn't ran in one`, { n: commandName });
				return createInteractionResponse({
					type: InteractionResponseType.ChannelMessageWithSource,
					data: {
						embeds: [
							genericErrorEmbed({
								language: defaultLangauge,
								requestId: ctx.requestId,
							}),
						],
					},
				});
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
	}

	return respondWith(ctx, 400, "Invalid request");
}
