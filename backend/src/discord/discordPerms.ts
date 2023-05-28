import { env } from "../configuration/env";
import { Ctx } from "../ctx";
import { objToStr } from "../utils";
import { discordApiRequest } from "./discordApiRequest";
import { APIChannel, APIGuild, APIGuildMember, ChannelType } from "discord-api-types/v10";

export type ResultMap = Map<PermissionString, boolean>;
type Result =
	| {
			error: string;
			details?: never;
			hasPerms?: never;
	  }
	| {
			error?: never;
			details: ResultMap;
			hasPerms: boolean;
	  };

export const hasPermsOnChannel = async (
	ctx: Ctx,
	guildId: string,
	channelId: bigint,
	neededPerms: PermissionString[]
): Promise<Result> => {
	const [
		{ error: channelError, data: channel },
		{ error: guildError, data: guild },
		{ error: memberError, data: member },
	] = await Promise.all([
		discordApiRequest<APIChannel>({
			ctx,
			method: "GET",
			path: `/channels/${channelId}`,
		}),
		discordApiRequest<APIGuild>({
			ctx,
			method: "GET",
			path: `/guilds/${guildId}`,
		}),
		discordApiRequest<APIGuildMember>({
			ctx,
			method: "GET",
			path: `/guilds/${guildId}/members/${env.DC_CLIENT_ID}`,
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
			error: `Failed to get channel - Cause: ${objToStr(channelError)}`,
		};
	}

	if (guildError)
		return {
			error: `Failed to get guild - Cause: ${objToStr(guildError)}`,
		};

	if (memberError)
		return {
			error: `Failed to get member - Cause: ${objToStr(memberError)}`,
		};

	if (!channel)
		return {
			error: `Channel is null with no errors`,
		};

	if (!guild)
		return {
			error: `Guild is null with no errors`,
		};

	if (!member)
		return {
			error: `Member is null with no errors`,
		};

	if (
		channel.type !== ChannelType.GuildText &&
		channel.type !== ChannelType.PublicThread &&
		channel.type !== ChannelType.GuildForum &&
		channel.type !== ChannelType.GuildAnnouncement
	)
		return {
			error: `Channel (might also be the parent) is not a text channel, a public thread, a forum or an announcement channel`,
		};

	const everyoneRole = guild.roles.find((role) => role.id === guildId);
	if (!everyoneRole) return { error: `Failed to find @everyone role` };

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
		(overwrite) => overwrite.id === String(env.DC_CLIENT_ID)
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

function calcPermissionStringsFromBits(bits: number) {
	return Object.keys(BitwisePermissionFlags).filter(
		(perm) =>
			(bits & BitwisePermissionFlags[perm as PermissionString]) ===
			BitwisePermissionFlags[perm as PermissionString]
	);
}

function calcPermissionBitsFromStrings(permissions: PermissionString[]) {
	return permissions.reduce((bits, perm) => {
		bits |= BigInt(BitwisePermissionFlags[perm]);
		return bits;
	}, BigInt(0));
}

function hasPerms(permissions: bigint, neededPerms: PermissionString[]) {
	const neededBigint = calcPermissionBitsFromStrings(neededPerms);

	return (BigInt(permissions) & neededBigint) === neededBigint;
}

export enum BitwisePermissionFlags {
	/** Allows creation of instant invites */
	CREATE_INSTANT_INVITE = 0x0000000000000001,
	/** Allows kicking members */
	KICK_MEMBERS = 0x0000000000000002,
	/** Allows banning members */
	BAN_MEMBERS = 0x0000000000000004,
	/** Allows all permissions and bypasses channel permission overwrites */
	ADMINISTRATOR = 0x0000000000000008,
	/** Allows management and editing of channels */
	MANAGE_CHANNELS = 0x0000000000000010,
	/** Allows management and editing of the guild */
	MANAGE_GUILD = 0x0000000000000020,
	/** Allows for the addition of reactions to messages */
	ADD_REACTIONS = 0x0000000000000040,
	/** Allows for viewing of audit logs */
	VIEW_AUDIT_LOG = 0x0000000000000080,
	/** Allows for using priority speaker in a voice channel */
	PRIORITY_SPEAKER = 0x0000000000000100,
	/** Allows the user to go live */
	STREAM = 0x0000000000000200,
	/** Allows guild members to view a channel, which includes reading messages in text channels and joining voice channels */
	VIEW_CHANNEL = 0x0000000000000400,
	/** Allows for sending messages in a channel. (does not allow sending messages in threads) */
	SEND_MESSAGES = 0x0000000000000800,
	/** Allows for sending of /tts messages */
	SEND_TTS_MESSAGES = 0x0000000000001000,
	/** Allows for deletion of other users messages */
	MANAGE_MESSAGES = 0x0000000000002000,
	/** Links sent by users with this permission will be auto-embedded */
	EMBED_LINKS = 0x0000000000004000,
	/** Allows for uploading images and files */
	ATTACH_FILES = 0x0000000000008000,
	/** Allows for reading of message history */
	READ_MESSAGE_HISTORY = 0x0000000000010000,
	/** Allows for using the @everyone tag to notify all users in a channel, and the @here tag to notify all online users in a channel */
	MENTION_EVERYONE = 0x0000000000020000,
	/** Allows the usage of custom emojis from other servers */
	USE_EXTERNAL_EMOJIS = 0x0000000000040000,
	/** Allows for viewing guild insights */
	VIEW_GUILD_INSIGHTS = 0x0000000000080000,
	/** Allows for joining of a voice channel */
	CONNECT = 0x0000000000100000,
	/** Allows for speaking in a voice channel */
	SPEAK = 0x0000000000200000,
	/** Allows for muting members in a voice channel */
	MUTE_MEMBERS = 0x0000000000400000,
	/** Allows for deafening of members in a voice channel */
	DEAFEN_MEMBERS = 0x0000000000800000,
	/** Allows for moving of members between voice channels */
	MOVE_MEMBERS = 0x0000000001000000,
	/** Allows for using voice-activity-detection in a voice channel */
	USE_VAD = 0x0000000002000000,
	/** Allows for modification of own nickname */
	CHANGE_NICKNAME = 0x0000000004000000,
	/** Allows for modification of other users nicknames */
	MANAGE_NICKNAMES = 0x0000000008000000,
	/** Allows management and editing of roles */
	MANAGE_ROLES = 0x0000000010000000,
	/** Allows management and editing of webhooks */
	MANAGE_WEBHOOKS = 0x0000000020000000,
	/** Allows management and editing of emojis */
	MANAGE_EMOJIS = 0x0000000040000000,
	/** Allows members to use application commands in text channels */
	USE_SLASH_COMMANDS = 0x0000000080000000,
	/** Allows for requesting to speak in stage channels. */
	REQUEST_TO_SPEAK = 0x0000000100000000,
	/** Allows for creating, editing, and deleting scheduled events */
	MANAGE_EVENTS = 0x0000000200000000,
	/** Allows for deleting and archiving threads, and viewing all private threads */
	MANAGE_THREADS = 0x0000000400000000,
	/** Allows for creating public and announcement threads */
	CREATE_PUBLIC_THREADS = 0x0000000800000000,
	/** Allows for creating private threads */
	CREATE_PRIVATE_THREADS = 0x0000001000000000,
	/** Allows the usage of custom stickers from other servers */
	USE_EXTERNAL_STICKERS = 0x0000002000000000,
	/** Allows for sending messages in threads */
	SEND_MESSAGES_IN_THREADS = 0x0000004000000000,
	/** Allows for launching activities (applications with the `EMBEDDED` flag) in a voice channel. */
	USE_EMBEDDED_ACTIVITIES = 0x0000008000000000,
	/** Allows for timing out users to prevent them from sending or reacting to messages in chat and threads, and from speaking in voice and stage channels */
	MODERATE_MEMBERS = 0x0000010000000000,
}

export type PermissionString = keyof typeof BitwisePermissionFlags;
