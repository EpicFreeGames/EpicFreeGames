import { APIChannel, APIGuild, APIGuildMember, ChannelType } from "discord-api-types/v10";

import { hasPerms } from "./hasPerms";
import { PermissionString } from "./types";
import { discordApi } from "../discordApi";
import { DiscordRequestContext } from "../context";
import { envs } from "../../configuration/env";
import { objToStr } from "../utils";

export type ResultMap = Map<PermissionString, boolean>;
type Result =
	| {
			error: boolean;
			cause: string;
			details?: never;
			hasPerms?: never;
	  }
	| {
			error?: never;
			cause?: never;
			details: ResultMap;
			hasPerms: boolean;
	  };

export const hasPermsOnChannel = async (
	ctx: DiscordRequestContext,
	guildId: string,
	channelId: string,
	neededPerms: PermissionString[]
): Promise<Result> => {
	const [
		{ error: channelError, data: channel },
		{ error: guildError, data: guild },
		{ error: memberError, data: member },
	] = await Promise.all([
		discordApi<APIChannel>(ctx, {
			method: "GET",
			path: `/channels/${channelId}`,
		}),
		discordApi<APIGuild>(ctx, {
			method: "GET",
			path: `/guilds/${guildId}`,
		}),
		discordApi<APIGuildMember>(ctx, {
			method: "GET",
			path: `/guilds/${guildId}/members/${envs.DC_CLIENT_ID}`,
		}),
	]);

	if (channelError) {
		// 50001 = Missing Access
		if (channelError?.code === 50001)
			return {
				hasPerms: false,
				details: setAllPerms(neededPerms, new Map(), false),
			};

		return {
			error: true,
			cause: `Failed to get channel - Cause: ${objToStr(channelError)}`,
		};
	}

	if (guildError)
		return {
			error: true,
			cause: `Failed to get guild - Cause: ${objToStr(guildError)}`,
		};

	if (memberError)
		return {
			error: true,
			cause: `Failed to get member - Cause: ${objToStr(memberError)}`,
		};

	if (!channel)
		return {
			error: true,
			cause: `Channel is null with no errors`,
		};

	if (!guild)
		return {
			error: true,
			cause: `Guild is null with no errors`,
		};

	if (!member)
		return {
			error: true,
			cause: `Member is null with no errors`,
		};

	if (
		channel.type !== ChannelType.GuildText &&
		channel.type !== ChannelType.PublicThread &&
		channel.type !== ChannelType.GuildForum &&
		channel.type !== ChannelType.GuildAnnouncement
	)
		return {
			error: true,
			cause: `Channel (might also be the parent) is not a text channel, a public thread, a forum or an announcement channel`,
		};

	const everyoneRole = guild.roles.find((role) => role.id === guildId);
	if (!everyoneRole) return { error: true, cause: `Failed to find @everyone role` };

	const result: ResultMap = new Map();

	const memberRoles = guild.roles.filter((role) => member.roles.includes(role.id));

	let permissions = BigInt(everyoneRole.permissions);

	for (const role of memberRoles) permissions |= BigInt(role.permissions);

	if (hasPerms(permissions, ["ADMINISTRATOR"]))
		return { details: setAllPerms(neededPerms, result, true), hasPerms: true };

	const channelOverwrites = channel.permission_overwrites ?? [];

	const everyoneOverwrite = channelOverwrites.find((overwrite) => overwrite.id === guildId);
	if (everyoneOverwrite) {
		permissions &= ~BigInt(everyoneOverwrite.deny);
		permissions |= BigInt(everyoneOverwrite.allow);
	}

	let rolesAllow = BigInt(0);
	let rolesDeny = BigInt(0);

	for (const role of memberRoles) {
		const roleOverwrite = channelOverwrites.find((overwrite) => overwrite.id === role.id);
		if (roleOverwrite) {
			rolesDeny |= BigInt(roleOverwrite.deny);
			rolesAllow |= BigInt(roleOverwrite.allow);
		}
	}

	permissions &= ~rolesDeny;
	permissions |= rolesAllow;

	const memberOverwrite = channelOverwrites.find(
		(overwrite) => overwrite.id === String(envs.DC_CLIENT_ID)
	);
	if (memberOverwrite) {
		permissions &= ~BigInt(memberOverwrite.deny);
		permissions |= BigInt(memberOverwrite.allow);
	}

	let botHasPerms = true;

	for (const neededPermissions of neededPerms) {
		const hasPerm = hasPerms(permissions, [neededPermissions]);

		if (!hasPerm) botHasPerms = false;

		result.set(neededPermissions, hasPerm);
	}

	return { details: result, hasPerms: botHasPerms };
};

const setAllPerms = (neededPerms: PermissionString[], resultMap: ResultMap, setTo: boolean) => {
	neededPerms.forEach((perm) => resultMap.set(perm, setTo));
	return resultMap;
};
