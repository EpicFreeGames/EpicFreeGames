import {
	isChatInputApplicationCommandInteraction,
	isGuildInteraction,
} from "discord-api-types/utils";
import {
	APIApplicationCommandInteraction,
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { Command } from "./commands/_commandType";
import { getTypedOption } from "./commands/_getTypedOption";
import { debugCommand } from "./commands/debugCommand";
import { freeCommand } from "./commands/freeCommand";
import { helpCommand } from "./commands/helpCommand";
import { inviteCommand } from "./commands/inviteCommand";
import { removeCommand } from "./commands/removeCommand/removeCommand";
import { setCommand } from "./commands/setCommand/setCommand";
import { settingsCommand } from "./commands/settingsCommand";
import { testCommand } from "./commands/testCommand";
import { upCommand } from "./commands/upCommand";
import { DiscordRequestContext } from "./context";
import { genericErrorEmbed, manageGuildCommandError } from "./embeds/errors";
import { currencies, defaultCurrency } from "./i18n/currency";
import { defaultLangauge, languages } from "./i18n/language";
import { hasPerms } from "./perms/hasPerms";

const commands = new Map<string, Command>([
	[freeCommand.name, freeCommand],
	[upCommand.name, upCommand],
	[helpCommand.name, helpCommand],
	[inviteCommand.name, inviteCommand],
	[setCommand.name, setCommand],
	[removeCommand.name, removeCommand],
	[settingsCommand.name, settingsCommand],
	[testCommand.name, testCommand],
	[debugCommand.name, debugCommand],
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
	const fullCommandName = subCommand ? `${commandName} ${subCommand.name}` : commandName;
	ctx.log("c", { fullCommandName, guildId: i?.guild_id, userId });

	const isGuild = isGuildInteraction(i);

	let language = defaultLangauge;
	let currency = defaultCurrency;

	let dbServer = undefined;

	if (isGuild) {
		dbServer = await ctx.db.discordServer.upsert({
			where: { discordId: i.guild_id },
			create: { discordId: i.guild_id },
			update: {},
		});

		language = languages.get(dbServer.languageCode ?? "") ?? language;
		currency = currencies.get(dbServer.currencyCode ?? "") ?? currency;
	}

	if (command.needsGuild) {
		if (!isGuild) {
			return ctx.respondWith(400, "This command needs to be run in a guild.");
		} else if (isGuild && dbServer) {
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

			logCommand(ctx, { fullCommandName, userId, discordServerId: i.guild_id });

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
		logCommand(ctx, { fullCommandName, userId, discordServerId: i.guild_id });

		return command.handle({
			ctx,
			i,
			currency,
			language,
			dbServer,
		});
	}
}

async function logCommand(
	ctx: DiscordRequestContext,
	props: {
		fullCommandName: string;
		userId: string;
		discordServerId?: string;
	}
) {
	return ctx.db.discordCommandLog
		.create({
			data: {
				command: props.fullCommandName,
				senderId: props.userId,
				serverId: props.discordServerId,
			},
		})
		.catch((e) => ctx.log("Catched an error logging command to db", { e }));
}
