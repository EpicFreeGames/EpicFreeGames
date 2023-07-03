import {
	APIChatInputApplicationCommandGuildInteraction,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { DbDiscordServer } from "../../../db/dbTypes";
import { DiscordRequestContext } from "../../context";
import { Currency } from "../../i18n/currency";
import { Language } from "../../i18n/language";
import { currentSettingsEmbed, settingsEmbed, updatedSettingsEmbed } from "../../embeds/settings";
import { genericErrorEmbed } from "../../embeds/errors";

export async function removeChannelCommand(props: {
	ctx: DiscordRequestContext;
	i: APIChatInputApplicationCommandGuildInteraction;
	language: Language;
	currency: Currency;
	dbServer: DbDiscordServer;
}) {
	try {
		if (!props.dbServer.channelId) {
			return props.ctx.respondWith(200, {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					flags: MessageFlags.Ephemeral,
					embeds: [
						currentSettingsEmbed(props.language),
						settingsEmbed(props.dbServer, props.language, props.currency),
					],
				},
			});
		}

		const updatedDbServerRes = await props.ctx.mongo.discordServers.findOneAndUpdate(
			{ discordId: props.dbServer.discordId },
			{
				$set: {
					channelId: null,
					webhookId: null,
					webhookToken: null,
					threadId: null,
				},
			},
			{ returnDocument: "after" }
		);

		if (!updatedDbServerRes.ok || !updatedDbServerRes.value) {
			props.ctx.log("Failed to remove channel - failed to update db server", {
				error: updatedDbServerRes.lastErrorObject,
			});

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

		return props.ctx.respondWith(200, {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				flags: MessageFlags.Ephemeral,
				embeds: [
					updatedSettingsEmbed(props.language),
					settingsEmbed(updatedDbServerRes.value, props.language, props.currency),
				],
			},
		});
	} catch (e) {
		props.ctx.log("Failed to remove channel - catched an error", { error: e });
	}
}
