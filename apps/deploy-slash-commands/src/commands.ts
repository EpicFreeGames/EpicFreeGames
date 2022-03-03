import { ApplicationCommandOptionTypes, ChannelTypes } from "discord.js/typings/enums";
import { CommandTypes, LanguagesWithFlags, RawCommand, CurrenciesWithDesc } from "shared";

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
      description: "Set a channel or a role",
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
          name: "language",
          description: "Change my language!",
          options: [
            {
              type: ApplicationCommandOptionTypes.STRING,
              name: "language",
              description: "The language",
              required: true,
              choices: Object.entries(LanguagesWithFlags).map(([value, name]) => {
                return { name, value };
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
              choices: Object.entries(CurrenciesWithDesc).map(([value, name]) => {
                return { name, value };
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
      description: "Remove the set role",
      options: [
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "role",
          description: "Remove the set role",
        },
        {
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "channel",
          description: "Remove the set channel",
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
    },
  },

  {
    type: CommandTypes.ADMIN,
    data: {
      name: "stats",
      description: "Use this to get bot statistics (admin only)",
    },
  },

  {
    type: CommandTypes.ADMIN,
    data: {
      name: "games",
      description: "Get all games (admin only)",
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
];
