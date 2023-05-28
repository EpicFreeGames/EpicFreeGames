import {
	ApplicationCommandOptionType,
	ChannelType,
	PermissionFlagsBits,
	RESTPutAPIApplicationCommandsJSONBody,
	RESTPutAPIApplicationGuildCommandsJSONBody,
} from "discord-api-types/v10";

export const globalCommands: RESTPutAPIApplicationCommandsJSONBody = [
	{
		name: "set",
		description: "Modify my settings on this server",
		dm_permission: false,
		default_member_permissions: String(PermissionFlagsBits.ManageGuild),
		options: [
			{
				name: "channel",
				description: "Pick a channel I'll post new free games on",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "channel",
						description: "A channel of your choice",
						type: ApplicationCommandOptionType.Channel,
						channel_types: [ChannelType.GuildAnnouncement, ChannelType.GuildText],
						required: true,
					},
				],
			},
			{
				name: "thread",
				description: "Pick a thread I'll post new free games on",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "thread",
						description: "A public active thread of your choice",
						type: ApplicationCommandOptionType.Channel,
						channel_types: [ChannelType.PublicThread],
						required: true,
					},
				],
			},
			{
				name: "role",
				description: "Pick a role I'll ping when a new game comes free",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "role",
						description: "A role of your choice",
						type: ApplicationCommandOptionType.Role,
						required: true,
					},
				],
			},
			{
				name: "language",
				description: "Pick a language for my messages on this server",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "language",
						description: "The language",
						type: ApplicationCommandOptionType.String,
						required: true,
						autocomplete: true,
					},
				],
			},
			{
				name: "currency",
				description: "Pick a currency for the games' prices on this server",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "currency",
						description: "The currency",
						type: ApplicationCommandOptionType.String,
						required: true,
						autocomplete: true,
					},
				],
			},
		],
	},
	{
		name: "remove",
		description: "Modify my settings on this server",
		default_member_permissions: String(PermissionFlagsBits.ManageGuild),
		dm_permission: false,
		options: [
			{
				name: "channel",
				description: "Remove the set channel (or thread)",
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: "role",
				description: "Remove the set role",
				type: ApplicationCommandOptionType.Subcommand,
			},
		],
	},
	{
		name: "invite",
		description: "Get my invite link",
	},
	{
		name: "help",
		description: "Use this if you need some help",
	},
	{
		name: "debug",
		default_member_permissions: String(PermissionFlagsBits.ManageGuild),
		dm_permission: false,
		description: "Used for debugging",
	},
	{
		name: "up",
		description: "See the upcoming free games",
	},
	{
		name: "free",
		description: "See the current free games",
	},
	{
		name: "settings",
		default_member_permissions: String(PermissionFlagsBits.ManageGuild),
		dm_permission: false,
		description: "See the settings",
	},
	{
		name: "vote",
		description: "Vote for me",
	},
	{
		name: "test",
		default_member_permissions: String(PermissionFlagsBits.ManageGuild),
		dm_permission: false,
		description: "Sends a test message to the set channel and pings the set role",
	},
];

export const guildCommands: RESTPutAPIApplicationGuildCommandsJSONBody = [
	{
		name: "send",
		description: "Start sending the free game notifications",
	},
	{
		name: "games",
		description: "Games related commands",
		options: [
			{
				name: "add",
				description: "Add a game",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "name",
						description: "The name of the game",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
					{
						name: "image-url",
						description: "The image url of the game",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
					{
						name: "path",
						description: "The path of the game",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
					{
						name: "start-epoch",
						description: "The start date of the game (epoch ms)",
						type: ApplicationCommandOptionType.Integer,
						required: true,
					},
					{
						name: "end-epoch",
						description: "The end date of the game (epoch ms)",
						type: ApplicationCommandOptionType.Integer,
						required: true,
					},
					{
						name: "usd-price",
						description: "The price of the game in USD",
						type: ApplicationCommandOptionType.Number,
						required: true,
					},
				],
			},
			{
				name: "remove",
				description: "Remove a game",
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: "edit",
				description: "Edit a game",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "game-id",
						description: "The id of the game",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
					{
						name: "name",
						description: "The name of the game",
						type: ApplicationCommandOptionType.String,
					},
					{
						name: "image-url",
						description: "The image url of the game",
						type: ApplicationCommandOptionType.String,
					},
					{
						name: "path",
						description: "The path of the game",
						type: ApplicationCommandOptionType.String,
					},
					{
						name: "start-epoch",
						description: "The start date of the game (epoch ms)",
						type: ApplicationCommandOptionType.Integer,
					},
					{
						name: "end-epoch",
						description: "The end date of the game (epoch ms)",
						type: ApplicationCommandOptionType.Integer,
					},
					{
						name: "usd-price",
						description: "The price of the game in USD",
						type: ApplicationCommandOptionType.Number,
					},
					{
						name: "confirmed",
						description: "Whether the game is confirmed",
						type: ApplicationCommandOptionType.Boolean,
					},
				],
			},
			{
				name: "get",
				description: "Get all games",
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: "get-one",
				description: "Get one game",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "game-id",
						description: "The id of the game",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
				],
			},
		],
	},
];
