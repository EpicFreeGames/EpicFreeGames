import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  InteractionResponseTypes,
} from "discordeno";
import { api } from "~shared/api.ts";
import { embeds } from "~shared/embeds/mod.ts";
import { Server } from "~shared/types.ts";
import { Command, CommandExecuteProps, EphemeralFlag } from "./mod.ts";

export const removeCommand: Command = {
  name: "remove",
  description: "Remove channel, thread or role",

  options: [
    {
      name: "channel",
      description: "Remove the set channel (or thread)",
      type: ApplicationCommandOptionTypes.SubCommand,
    },
    {
      name: "role",
      description: "Remove the set role",
      type: ApplicationCommandOptionTypes.SubCommand,
    },
  ],

  needsGuild: true,
  needsManageGuild: true,
  type: ApplicationCommandTypes.ChatInput,

  execute: ({ commandName, ...rest }) => {
    if (commandName.includes("channel")) return removeChannelHandler({ commandName, ...rest });

    if (commandName.includes("role")) return removeRoleHandler({ commandName, ...rest });
  },
};

const removeChannelHandler = async ({ bot, i, server, lang, curr }: CommandExecuteProps) => {
  // if no channelId, don't bother calling api
  if (!server?.channelId)
    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        flags: EphemeralFlag,
        embeds: [
          embeds.success.currentSettings(lang),
          embeds.commands.settings(server, lang, curr),
        ],
      },
    });

  const { error, data: updatedServer } = await api<Server>({
    method: "DELETE",
    path: `/servers/${server.id}/role`,
  });

  await bot.helpers.sendInteractionResponse(i.id, i.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      flags: EphemeralFlag,
      embeds: error
        ? [embeds.errors.genericError()]
        : [
            embeds.success.updatedSettings(lang),
            embeds.commands.settings(updatedServer, lang, curr),
          ],
    },
  });
};

const removeRoleHandler = async ({ bot, i, server, lang, curr }: CommandExecuteProps) => {
  // if no channelId, don't bother calling api
  if (!server?.channelId)
    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        flags: EphemeralFlag,
        embeds: [
          embeds.success.currentSettings(lang),
          embeds.commands.settings(server, lang, curr),
        ],
      },
    });

  const { error, data: updatedServer } = await api<Server>({
    method: "DELETE",
    path: `/servers/${server.id}/role`,
  });

  await bot.helpers.sendInteractionResponse(i.id, i.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      flags: EphemeralFlag,
      embeds: error
        ? [embeds.errors.genericError()]
        : [
            embeds.success.updatedSettings(lang),
            embeds.commands.settings(updatedServer, lang, curr),
          ],
    },
  });
};
