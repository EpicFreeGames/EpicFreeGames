import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ChannelTypes } from "discordeno";
import { Command } from "../mod.ts";
import { setChannelCommand } from "./channel.ts";
import { setCurrencyCommand } from "./currency.ts";
import { setLanguageCommand } from "./language.ts";
import { setRoleCommand } from "./role.ts";

export const setCommand: Command = {
  name: "set",
  description: "Manage my settings on this server",

  options: [
    {
      name: "channel",
      description: "Pick a channel I'll post new free games on",
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
      description: "Pick a role I'll ping when a new game becomes free",
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
    {
      name: "language",
      description: "Pick a language you'd like my messages to be in",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          type: ApplicationCommandOptionTypes.String,
          name: "language",
          description: "Language",
          required: true,
          autocomplete: true,
        },
      ],
    },
    {
      name: "currency",
      description: "Pick a currency you'd like the prices to be in",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          type: ApplicationCommandOptionTypes.String,
          name: "currency",
          description: "Currency",
          required: true,
          autocomplete: true,
        },
      ],
    },
  ],

  needsGuild: true,
  needsManageGuild: true,
  type: ApplicationCommandTypes.ChatInput,

  execute: ({ commandName, ...rest }) => {
    if (commandName.includes("channel")) return setChannelCommand({ commandName, ...rest });
    else if (commandName.includes("role")) return setRoleCommand({ commandName, ...rest });
    else if (commandName.includes("language")) return setLanguageCommand({ commandName, ...rest });
    else if (commandName.includes("currency")) return setCurrencyCommand({ commandName, ...rest });
  },
};

type SorterProps = {
  a: string;
  b: string;
  query: string;
};

export const autoCompleteSorter = ({ a, b, query }: SorterProps) => {
  if (a.indexOf(query) < b.indexOf(query)) return -1;
  else if (a.indexOf(query) > b.indexOf(query)) return 1;
  else return 0;
};
