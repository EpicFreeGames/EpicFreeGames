import {
	APIChatInputApplicationCommandGuildInteraction,
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { DiscordRequestContext } from "../../../context";
import { discord_server } from "@prisma/client";
import { getTypedOption } from "../../_getTypedOption";
import { genericErrorEmbed } from "../../../embeds/errors";
import { editInteractionResponse } from "../../../utils";
import { settingsEmbed, updatedSettingsEmbed } from "../../../embeds/settings";
import { Language, languages } from "../../../i18n/language";
import { Currency } from "../../../i18n/currency";
import { DbDiscordServer } from "../../../../db/dbTypes";

export const setLanguageSubCommand = async (props: {
	ctx: DiscordRequestContext;
	i: APIChatInputApplicationCommandGuildInteraction;
	language: Language;
	currency: Currency;
	dbServer: DbDiscordServer;
}) => {
	try {
		const languageOption = getTypedOption(
			props.i,
			ApplicationCommandOptionType.String,
			"language"
		);
		const newLanguageCode = languageOption?.value;
		if (!languageOption || !newLanguageCode) return;

		const newLanguage = languages.get(newLanguageCode);

		if (!newLanguage) {
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
			{ $set: { languageCode: newLanguageCode } },
			{ returnDocument: "after" }
		);

		if (!updatedDbServerRes.ok) {
			props.ctx.log("Failed to set language - failed to update db server", {
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
			props.ctx.log("Failed to set language - failed to update db server, value falsy");

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
		props.ctx.log("Failed to set language - catched an error", {
			error: e,
		});
	}
};
