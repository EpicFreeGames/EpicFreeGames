import { ILanguage, ICurrency } from "./data";
import { CurrencyDocument, LanguageDocument } from "./data/DocTypes";

export enum CommandTypes {
  EVERYONE = "EVERYONE",
  MANAGE_GUILD = "MANAGE_GUILD",
  ADMIN = "ADMIN",
}

export interface RawCommand {
  type: CommandTypes;
  data: any;
}

export const getCommands = (
  languages: (LanguageDocument | ILanguage)[],
  currencies: (CurrencyDocument | ICurrency)[]
): RawCommand[] => [
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
    },
  },

  {
    type: CommandTypes.MANAGE_GUILD,
    data: {
      name: "set",
      description: "Manage my settings on this server",
      dm_permission: false,
      default_member_permissions: 1 << 5,
      options: [
        {
          type: 1,
          name: "role",
          description: "I'll ping this role when I post new games!",
          options: [
            {
              type: 8,
              name: "role",
              description: "A role of your choice",
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: "channel",
          description: "I'll post the new games here now and always in the future!",
          options: [
            {
              type: 7,
              channel_types: [0, 5],
              name: "channel",
              description: "A channel of your choice",
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: "thread",
          description: "I'll post the new games here now and always in the future!",
          options: [
            {
              type: 7,
              channel_types: [10, 11],
              name: "thread",
              description: "An active public thread of your choice",
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: "language",
          description: "Change my language!",
          options: [
            {
              type: 3,
              name: "language",
              description: "The language",
              required: true,
              choices: languages.map((language) => {
                return { name: language.localizedName, value: language.code };
              }),
            },
          ],
        },
        {
          type: 1,
          name: "currency",
          description: "Change my currency!",
          options: [
            {
              type: 3,
              name: "currency",
              description: "The currency",
              required: true,
              choices: currencies.map((currency) => {
                return { name: currency.name, value: currency.code };
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
      default_member_permissions: 1 << 5,
      options: [
        {
          type: 1,
          name: "role",
          description: "Remove the set role",
        },
        {
          type: 1,
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
          type: 1,
          name: "basic",
          description: "Get basic statistics",
        },
        {
          type: 1,
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
          type: 1,
          name: "get",
          description: "Get all games (admin only)",
        },
        {
          type: 1,
          name: "confirm",
          description: "Confirm a game (admin only)",
          options: [
            {
              type: 3,
              name: "ids",
              description: "The game ids (<id>, <id>, ...)",
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: "confirm-all",
          description: "Confirm all games (admin only)",
        },
        {
          type: 1,
          name: "unconfirm",
          description: "Unconfirm a game (admin only)",
          options: [
            {
              type: 3,
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
          type: 3,
          name: "game_ids",
          description: "The game ids (<id>, <id>, ...)",
          required: true,
        },
        {
          type: 3,
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
      default_member_permissions: 1 << 5,
    },
  },
];
