import {
	APIChatInputApplicationCommandGuildInteraction,
	InteractionResponseType,
	MessageFlags,
} from "discord-api-types/v10";
import { DiscordRequestContext } from "../../context";
import { Language } from "../../i18n/language";
import { Currency } from "../../i18n/currency";
import { discord_server } from "@prisma/client";
import { editInteractionResponse } from "../../utils";
import { settingsEmbed, updatedSettingsEmbed } from "../../embeds/settings";

export async function removeChannelSubCommand(props: {
	ctx: DiscordRequestContext;
	i: APIChatInputApplicationCommandGuildInteraction;
	language: Language;
	currency: Currency;
	dbServer: discord_server;
}) {
	try {
		props.ctx.respondWith(200, {
			type: InteractionResponseType.DeferredChannelMessageWithSource,
			data: { flags: MessageFlags.Ephemeral },
		});

		const updatedDbServer = await props.ctx.db.discord_server.update({
			where: { id: props.dbServer.id },
			data: {
				channel_id: null,
				thread_id: null,
				webhook_id: null,
				webhook_token: null,
			},
		});

		await editInteractionResponse(props.ctx, props.i, {
			flags: MessageFlags.Ephemeral,
			embeds: [
				updatedSettingsEmbed(props.language),
				settingsEmbed(updatedDbServer, props.language, props.currency),
			],
		});
	} catch (e) {
		props.ctx.log("Failed to remove channel - catched an error", {
			error: e,
		});
	}
}
