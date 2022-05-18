import { ApplicationCommandOptionTypes, ChannelTypes } from "discord.js/typings/enums";
import { CommandTypes, LanguagesWithFlags, RawCommand, CurrencyData } from "shared-discord-stuff";

export const slashCommands: RawCommand[] = [
  {
    type: CommandTypes.EVERYONE,
    data: {
      name: "free",
      description: "I'll reply with the current free game(s)!",
    },
  },

  {
    type: CommandTypes.EVERYONE,
    data: {
      name: "up",
      description: "I'll reply with the upcoming free game(s)!",
      options: [],
    },
  },

  {
    type: CommandTypes.MANAGE_GUILD,
    data: {
      name: "set",
      description: "Manage my settings on this server",
      dm_permission: false,
      options: [
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "role",
          description: "I'll ping this role when I post new games!",
          options: [
            {
              type: ApplicationCommandOptionTypes.ROLE,
              name: "role",
              description: "A role of your choice",
              required: true,
            },
          ],
        },
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "channel",
          description: "I'll post the new games here now and always in the future!",
          options: [
            {
              type: ApplicationCommandOptionTypes.CHANNEL,
              channel_types: [ChannelTypes.GUILD_TEXT, ChannelTypes.GUILD_NEWS],
              name: "channel",
              description: "A channel of your choice",
              required: true,
            },
          ],
        },
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "thread",
          description: "I'll post the new games here now and always in the future!",
          options: [
            {
              type: ApplicationCommandOptionTypes.CHANNEL,
              channel_types: [ChannelTypes.GUILD_NEWS_THREAD, ChannelTypes.GUILD_PUBLIC_THREAD],
              name: "thread",
              description: "An active public thread of your choice",
              required: true,
            },
          ],
        },
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "language",
          description: "Change my language!",
          options: [
            {
              type: ApplicationCommandOptionTypes.STRING,
              name: "language",
              description: "The language",
              required: true,
              choices: Object.entries(LanguagesWithFlags).map(([key, value]) => {
                return { name: value, value: key };
              }),
            },
          ],
        },
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "currency",
          description: "Change my currency!",
          options: [
            {
              type: ApplicationCommandOptionTypes.STRING,
              name: "currency",
              description: "The currency",
              required: true,
              choices: Object.entries(CurrencyData).map(([key, value]) => {
                return { name: value.name, value: key };
              }),
            },
          ],
        },
      ],
    },
  },

  {
    type: CommandTypes.MANAGE_GUILD,
    data: {
      name: "remove",
      description: "Remove the set role, set channel or the set thread",
      dm_permission: false,
      options: [
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "role",
          description: "Remove the set role",
        },
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "channel",
          description: "Remove the set channel (or thread)",
        },
      ],
    },
  },

  {
    type: CommandTypes.EVERYONE,
    data: {
      name: "help",
      description: "Use this if you need help.",
    },
  },

  {
    type: CommandTypes.EVERYONE,
    data: {
      name: "vote",
      description: "Use this if want to vote me on top.gg!",
    },
  },

  {
    type: CommandTypes.EVERYONE,
    data: {
      name: "invite",
      description: "Use this to get my invite link!",
    },
  },

  {
    type: CommandTypes.EVERYONE,
    data: {
      name: "debug",
      description: "Use this to get debug information",
      dm_permission: false,
    },
  },

  {
    type: CommandTypes.ADMIN,
    data: {
      name: "stats",
      description: "Use this to get bot statistics (admin only)",
      options: [
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "basic",
          description: "Get basic statistics",
        },
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "commands",
          description: "Get command statistics",
        },
      ],
    },
  },

  {
    type: CommandTypes.ADMIN,
    data: {
      name: "games",
      description: "Admin only commands to manage games",
      options: [
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "get",
          description: "Get all games (admin only)",
        },
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "confirm",
          description: "Confirm a game (admin only)",
          options: [
            {
              type: ApplicationCommandOptionTypes.STRING,
              name: "ids",
              description: "The game ids (<id>, <id>, ...)",
              required: true,
            },
          ],
        },
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "confirm-all",
          description: "Confirm all games (admin only)",
        },
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "unconfirm",
          description: "Unconfirm a game (admin only)",
          options: [
            {
              type: ApplicationCommandOptionTypes.STRING,
              name: "ids",
              description: "The game ids (<id>, <id>, ...)",
              required: true,
            },
          ],
        },
      ],
    },
  },

  {
    type: CommandTypes.ADMIN,
    data: {
      name: "send",
      description: "Send games (admin only)",
      options: [
        {
          type: ApplicationCommandOptionTypes.STRING,
          name: "game_ids",
          description: "The game ids (<id>, <id>, ...)",
          required: true,
        },
        {
          type: ApplicationCommandOptionTypes.STRING,
          name: "sending_id",
          description: "The sending id (optional)",
        },
      ],
    },
  },

  {
    type: CommandTypes.MANAGE_GUILD,
    data: {
      name: "settings",
      description: "Use this to get my settings on this server",
      dm_permission: false,
    },
  },
];
