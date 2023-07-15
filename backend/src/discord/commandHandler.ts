import {
	APIApplicationCommandInteraction,
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { DiscordRequestContext } from "./context";
import {
	isChatInputApplicationCommandInteraction,
	isGuildInteraction,
} from "discord-api-types/utils";
import { Command } from "./commands/_commandType";
import { freeCommand } from "./commands/freeCommand";
import { hasPerms } from "./perms/hasPerms";
import { genericErrorEmbed, manageGuildCommandError } from "./embeds/errors";
import { defaultLangauge, languages } from "./i18n/language";
import { currencies, defaultCurrency } from "./i18n/currency";
import { upCommand } from "./commands/upCommand";
import { helpCommand } from "./commands/helpCommand";
import { inviteCommand } from "./commands/inviteCommand";
import { setCommand } from "./commands/setCommand/setCommand";
import { getTypedOption } from "./commands/_getTypedOption";
import { removeCommand } from "./commands/removeCommand/removeCommand";
import { settingsCommand } from "./commands/settingsCommand";

const commands = new Map<string, Command>([
	[freeCommand.name, freeCommand],
	[upCommand.name, upCommand],
	[helpCommand.name, helpCommand],
	[inviteCommand.name, inviteCommand],
	[setCommand.name, setCommand],
	[removeCommand.name, removeCommand],
	[settingsCommand.name, settingsCommand],
]);

export async function commandHandler(
	ctx: DiscordRequestContext,
	i: APIApplicationCommandInteraction
) {
	if (!isChatInputApplicationCommandInteraction(i)) {
		return ctx.respondWith(400, "This command type is not supported.");
	}

	const commandName = i.data.name;

	const command = commands.get(commandName);
	if (!command) {
		return ctx.respondWith(404, `Command '${commandName}' not found`);
	}

	const userId = (i.member?.user ?? i.user)?.id!;
	const subCommand = getTypedOption(i, ApplicationCommandOptionType.Subcommand);
	ctx.log("c", { commandName, subCommand: subCommand?.name, guildId: i?.guild_id, userId });

	const isGuild = isGuildInteraction(i);

	let language = defaultLangauge;
	let currency = defaultCurrency;

	let dbServer = undefined;

	if (isGuild) {
		dbServer = await ctx.db.discord_server.upsert({
			where: { discord_id: i.guild_id },
			create: { discord_id: i.guild_id },
			update: {},
		});
	}

	if (command.needsGuild) {
		if (!isGuild) {
			return ctx.respondWith(400, "This command needs to be run in a guild.");
		} else if (isGuild && dbServer) {
			language = languages.get(dbServer.language_code ?? "") ?? language;
			currency = currencies.get(dbServer.currency_code ?? "") ?? currency;

			if (
				command.needsManageGuild &&
				!hasPerms(BigInt(i?.member?.permissions || 0n), ["MANAGE_GUILD"])
			) {
				ctx.log("No manage guild");
				return ctx.respondWith(200, {
					type: InteractionResponseType.ChannelMessageWithSource,
					data: {
						flags: MessageFlags.Ephemeral,
						embeds: [manageGuildCommandError(language)],
					},
				});
			}

			return command.handle({
				ctx,
				i,
				currency,
				language,
				dbServer,
			});
		} else {
			ctx.log("Command required guild but got not dbServer", {
				dbServer,
				commandName: command.name,
				isGuild,
			});

			return ctx.respondWith(200, {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					flags: MessageFlags.Ephemeral,
					embeds: [genericErrorEmbed({ language, requestId: ctx.requestId })],
				},
			});
		}
	} else {
		return command.handle({
			ctx,
			i,
			currency,
			language,
			dbServer,
		});
	}
}
