import { DiscordServer } from "@prisma/client";
import {
	APIChatInputApplicationCommandGuildInteraction,
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
	RESTGetAPIGuildRolesResult,
} from "discord-api-types/v10";
import { DiscordRequestContext } from "../../context";
import { discordApi } from "../../discordApi";
import { channelNotSetEmbed, genericErrorEmbed } from "../../embeds/errors";
import { roleSetEmbed } from "../../embeds/setRole";
import { settingsEmbed } from "../../embeds/settings";
import { Currency } from "../../i18n/currency";
import { Language } from "../../i18n/language";
import { editInteractionResponse } from "../../utils";
import { getTypedOption } from "../_getTypedOption";

export const setRoleSubCommand = async (props: {
	ctx: DiscordRequestContext;
	i: APIChatInputApplicationCommandGuildInteraction;
	language: Language;
	currency: Currency;
	dbServer: DiscordServer;
}) => {
	try {
		if (!props.dbServer.channelId) {
			return props.ctx.respondWith(200, {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					embeds: [channelNotSetEmbed(props.language)],
				},
			});
		}

		props.ctx.respondWith(200, {
			type: InteractionResponseType.DeferredChannelMessageWithSource,
			data: { flags: MessageFlags.Ephemeral },
		});

		const roleOption = getTypedOption(props.i, ApplicationCommandOptionType.Role, "role");
		const selectedRoleId = roleOption?.value;
		if (!roleOption || !selectedRoleId) return;

		const roleResult = await discordApi<RESTGetAPIGuildRolesResult>(props.ctx, {
			method: "GET",
			path: `/guilds/${props.i.guild_id}/roles`,
		});

		if (roleResult.error) {
			props.ctx.log("Failed to set role - failed to fetch guild roles", {
				error: roleResult.error,
				selectedRoleId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});
		}

		const selectedRole = roleResult.data?.find((r) => r.id === selectedRoleId);
		if (!selectedRole) {
			props.ctx.log("Failed to set role - failed to find selected role", {
				selectedRoleId,
			});

			await editInteractionResponse(props.ctx, props.i, {
				flags: MessageFlags.Ephemeral,
				embeds: [
					genericErrorEmbed({ language: props.language, requestId: props.ctx.requestId }),
				],
			});
		}

		const useful = makeSenseOfRole(selectedRole);

		const updatedDbServer = await props.ctx.db.discordServer.update({
			where: { id: props.dbServer.id },
			data: { roleId: useful.toDb },
		});

		await editInteractionResponse(props.ctx, props.i, {
			embeds: [
				roleSetEmbed({ language: props.language, role: useful.embed }),
				settingsEmbed(updatedDbServer, props.language, props.currency),
			],
		});
	} catch (e) {
		props.ctx.log("Failed to set role - catched an error", {
			error: e,
		});
	}
};

function makeSenseOfRole(role: any) {
	if (role.name === "@everyone") return { embed: "@everyone", toDb: "1" };
	return { embed: `<@&${role.id}>`, toDb: role.id };
}
