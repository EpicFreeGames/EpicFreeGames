import {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
  RESTPutAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";

import { defaultLanguage, t } from "@efg/i18n";

export const commands: RESTPutAPIApplicationCommandsJSONBody = [
  {
    name: "set",
    description: "Modify my settings on this server",
    dm_permission: false,
    default_member_permissions: String(PermissionFlagsBits.ManageGuild),
    options: [
      {
        name: "channel",
        description: t({ key: "cmd_desc_set_channel", language: defaultLanguage }),
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
        description: t({ key: "cmd_desc_set_channel", language: defaultLanguage }),
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
        description: t({ key: "cmd_desc_set_role", language: defaultLanguage }),
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
        description: t({ key: "cmd_desc_set_language", language: defaultLanguage }),
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
        description: t({ key: "cmd_desc_set_currency", language: defaultLanguage }),
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
        description: t({ key: "cmd_desc_remove_channel", language: defaultLanguage }),
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "role",
        description: t({ key: "cmd_desc_remove_role", language: defaultLanguage }),
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
  },
  {
    name: "invite",
    description: t({ key: "cmd_desc_invite", language: defaultLanguage }),
  },
  {
    name: "help",
    description: t({ key: "cmd_desc_help", language: defaultLanguage }),
  },
  {
    name: "debug",
    default_member_permissions: String(PermissionFlagsBits.ManageGuild),
    dm_permission: false,
    description: t({ key: "cmd_desc_debug", language: defaultLanguage }),
  },
  {
    name: "up",
    description: t({ key: "cmd_desc_up", language: defaultLanguage }),
  },
  {
    name: "free",
    description: t({ key: "cmd_desc_free", language: defaultLanguage }),
  },
  {
    name: "settings",
    default_member_permissions: String(PermissionFlagsBits.ManageGuild),
    dm_permission: false,
    description: t({ key: "cmd_desc_settings", language: defaultLanguage }),
  },
  {
    name: "vote",
    description: t({ key: "cmd_desc_vote", language: defaultLanguage }),
  },
  {
    name: "test",
    default_member_permissions: String(PermissionFlagsBits.ManageGuild),
    dm_permission: false,
    description: t({ key: "cmd_desc_test", language: defaultLanguage }),
  },
];
