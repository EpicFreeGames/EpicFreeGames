import {
	type APIApplicationCommandAutocompleteInteraction,
	type APIChatInputApplicationCommandInteraction,
	ApplicationCommandOptionType,
	APIInteractionResponse,
	APIInteraction,
	APIInteractionResponseCallbackData,
	APIApplicationCommandInteractionDataBooleanOption,
	APIApplicationCommandInteractionDataChannelOption,
	APIApplicationCommandInteractionDataIntegerOption,
	APIApplicationCommandInteractionDataMentionableOption,
	APIApplicationCommandInteractionDataRoleOption,
	APIApplicationCommandInteractionDataStringOption,
	APIApplicationCommandInteractionDataSubcommandGroupOption,
	APIApplicationCommandInteractionDataSubcommandOption,
	APIApplicationCommandInteractionDataUserOption,
	APIApplicationCommandInteractionDataNumberOption,
} from "discord-api-types/v10";

export function getTypedOption<TType extends ApplicationCommandOptionType>(
	i: APIChatInputApplicationCommandInteraction | APIApplicationCommandAutocompleteInteraction,
	type: TType,
	name?: string
): TType extends ApplicationCommandOptionType.String
	? APIApplicationCommandInteractionDataStringOption | null
	: TType extends ApplicationCommandOptionType.Integer
	? APIApplicationCommandInteractionDataIntegerOption | null
	: TType extends ApplicationCommandOptionType.Number
	? APIApplicationCommandInteractionDataNumberOption | null
	: TType extends ApplicationCommandOptionType.Boolean
	? APIApplicationCommandInteractionDataBooleanOption | null
	: TType extends ApplicationCommandOptionType.User
	? APIApplicationCommandInteractionDataUserOption | null
	: TType extends ApplicationCommandOptionType.Channel
	? APIApplicationCommandInteractionDataChannelOption | null
	: TType extends ApplicationCommandOptionType.Role
	? APIApplicationCommandInteractionDataRoleOption | null
	: TType extends ApplicationCommandOptionType.Mentionable
	? APIApplicationCommandInteractionDataMentionableOption | null
	: TType extends ApplicationCommandOptionType.Subcommand
	? APIApplicationCommandInteractionDataSubcommandOption | null
	: TType extends ApplicationCommandOptionType.SubcommandGroup
	? APIApplicationCommandInteractionDataSubcommandGroupOption | null
	: never {
	// @ts-expect-error dont know how to fix
	if (!i.data.options) return null;

	for (const option of i.data.options) {
		if (option.type === type) {
			if (name && option.name !== name) continue;

			// @ts-expect-error dont know how to fix
			return option;
		} else if (option.type === ApplicationCommandOptionType.Subcommand) {
			if (!option.options) continue;

			for (const subOption of option.options) {
				if (subOption.type !== type) continue;
				if (name && subOption.name !== name) continue;

				// @ts-expect-error dont know how to fix
				return subOption;
			}
		} else if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
			if (!option.options) continue;

			for (const subCommand of option.options) {
				if (!subCommand.options) continue;

				for (const subCommandOption of subCommand.options) {
					if (subCommandOption.type !== type) continue;
					if (name && subCommandOption.name !== name) continue;

					// @ts-expect-error dont know how to fix
					return subCommandOption;
				}
			}
			// @ts-expect-error dont know how to fix
		} else return null;
	}

	// @ts-expect-error dont know how to fix
	return null;
}

export function getCommandName(
	i: APIChatInputApplicationCommandInteraction | APIApplicationCommandAutocompleteInteraction
) {
	const subCommand = getTypedOption(i, ApplicationCommandOptionType.Subcommand);
	return subCommand ? `/${i.data.name} ${subCommand.name}` : `/${i.data.name}`;
}

export function createInteractionResponse(data: APIInteractionResponse) {
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

export function respondToInteraction(i: APIInteraction, data: APIInteractionResponse) {
	return fetch(`https://discord.com/api/interactions/${i.id}/${i.token}/callback`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
}

export function editInteractionResponse(
	i: APIInteraction,
	data: APIInteractionResponseCallbackData
) {
	return fetch(
		`https://discord.com/api/webhooks/${i.application_id}/${i.token}/messages/@original`,
		{
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}
	);
}

export function followUpToInteraction(i: APIInteraction, data: APIInteractionResponseCallbackData) {
	return fetch(`https://discord.com/api/webhooks/${i.application_id}/${i.token}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
}
