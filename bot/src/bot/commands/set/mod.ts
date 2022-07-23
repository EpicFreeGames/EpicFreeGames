import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  ChannelTypes,
} from "discordeno";
import { Command } from "../mod.ts";
import { setChannelCommand } from "./channel.ts";
import { setRoleCommand } from "./role.ts";

export const setCommand: Command = {
  name: "set",
  description: "Manage my settings on this server",

  options: [
    {
      name: "channel",
      description: "Remove the set channel (or thread)",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          type: ApplicationCommandOptionTypes.Channel,
          channelTypes: [ChannelTypes.GuildNews, ChannelTypes.GuildText],
          name: "channel",
          description: "A channel of your choice",
          required: true,
        },
      ],
    },
    {
      name: "role",
      description: "I'll ping this role when I post new games!",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          type: ApplicationCommandOptionTypes.Role,
          name: "role",
          description: "A role of your choice",
          required: true,
        },
      ],
    },
  ],

  needsGuild: true,
  type: ApplicationCommandTypes.ChatInput,

  execute: ({ commandName, ...rest }) => {
    if (commandName.includes("channel"))
      return setChannelCommand({ commandName, ...rest });
    else if (commandName.includes("role"))
      return setRoleCommand({ commandName, ...rest });
  },
};
