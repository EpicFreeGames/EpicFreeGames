import {
	APIChatInputApplicationCommandGuildInteraction,
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { DbDiscordServer } from "../../../../db/dbTypes";
import { DiscordRequestContext } from "../../../context";
import { genericErrorEmbed } from "../../../embeds/errors";
import { settingsEmbed, updatedSettingsEmbed } from "../../../embeds/settings";
import { Currency, currencies } from "../../../i18n/currency";
import { Language } from "../../../i18n/language";
import { editInteractionResponse } from "../../../utils";
import { getTypedOption } from "../../_getTypedOption";

export const setCurrencySubCommand = async (props: {
	ctx: DiscordRequestContext;
	i: APIChatInputApplicationCommandGuildInteraction;
	language: Language;
	currency: Currency;
	dbServer: DbDiscordServer;
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

		const updatedDbServerRes = await props.ctx.mongo.discordServers.findOneAndUpdate(
			{ discordId: props.dbServer.discordId },
			{ $set: { currencyCode: newCurrencyCode } },
			{ returnDocument: "after" }
		);

		if (!updatedDbServerRes.ok) {
			props.ctx.log("Failed to set currency - failed to update db server", {
				error: updatedDbServerRes.lastErrorObject,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});

			return;
		}

		if (!updatedDbServerRes.value) {
			props.ctx.log("Failed to set currency - failed to update db server, value falsy");

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});

			return;
		}

		editInteractionResponse(props.ctx, props.i, {
			flags: MessageFlags.Ephemeral,
			embeds: [
				updatedSettingsEmbed(props.language),
				settingsEmbed(updatedDbServerRes.value, props.language, props.currency),
			],
		});
	} catch (e) {
		props.ctx.log("Failed to set currency - catched an error", {
			error: e,
		});
	}
};
