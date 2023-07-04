import {
	APIChatInputApplicationCommandGuildInteraction,
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { DiscordRequestContext } from "../../../context";
import { Language } from "../../../i18n/language";
import { Currency, currencies } from "../../../i18n/currency";
import { discord_server } from "@prisma/client";
import { getTypedOption } from "../../_getTypedOption";
import { genericErrorEmbed } from "../../../embeds/errors";
import { editInteractionResponse } from "../../../utils";
import { settingsEmbed, updatedSettingsEmbed } from "../../../embeds/settings";

export const setCurrencySubCommand = async (props: {
	ctx: DiscordRequestContext;
	i: APIChatInputApplicationCommandGuildInteraction;
	language: Language;
	currency: Currency;
	dbServer: discord_server;
}) => {
	try {
		const currencyOption = getTypedOption(
			props.i,
			ApplicationCommandOptionType.String,
			"currency"
		);
		const newCurrencyCode = currencyOption?.value;
		if (!currencyOption || !newCurrencyCode) return;

		const newCurrency = currencies.get(newCurrencyCode);

		if (!newCurrency) {
			return props.ctx.respondWith(200, {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					flags: MessageFlags.Ephemeral,
					embeds: [
						genericErrorEmbed({
							language: props.language,
							requestId: props.ctx.requestId,
						}),
					],
				},
			});
		}

		props.ctx.respondWith(200, {
			type: InteractionResponseType.DeferredChannelMessageWithSource,
			data: { flags: MessageFlags.Ephemeral },
		});

		await props.ctx.db.discord_server.update({
			where: { id: props.dbServer.id },
			data: { currency_code: newCurrencyCode },
		});

		editInteractionResponse(props.ctx, props.i, {
			flags: MessageFlags.Ephemeral,
			embeds: [
				updatedSettingsEmbed(props.language),
				settingsEmbed(props.dbServer, props.language, props.currency),
			],
		});
	} catch (e) {
		props.ctx.log("Catched an error in /set currency", {
			error: e,
			guildId: props.i.guild_id,
		});

		await editInteractionResponse(props.ctx, props.i, {
			flags: MessageFlags.Ephemeral,
			embeds: [
				genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
			],
		});
	}
};
