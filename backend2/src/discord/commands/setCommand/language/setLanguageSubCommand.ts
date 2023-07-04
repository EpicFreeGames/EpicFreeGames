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
import { Currency } from "../../../i18n/currency";
import { Language, languages } from "../../../i18n/language";
import { editInteractionResponse } from "../../../utils";
import { getTypedOption } from "../../_getTypedOption";
import { discord_server } from "@prisma/client";

export const setLanguageSubCommand = async (props: {
	ctx: DiscordRequestContext;
	i: APIChatInputApplicationCommandGuildInteraction;
	language: Language;
	currency: Currency;
	dbServer: discord_server;
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

		await props.ctx.db.discord_server.update({
			where: { id: props.dbServer.id },
			data: { language_code: newLanguageCode },
		});

		editInteractionResponse(props.ctx, props.i, {
			flags: MessageFlags.Ephemeral,
			embeds: [
				updatedSettingsEmbed(props.language),
				settingsEmbed(props.dbServer, props.language, props.currency),
			],
		});
	} catch (e) {
		props.ctx.log("Catched an error in /set language", {
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
