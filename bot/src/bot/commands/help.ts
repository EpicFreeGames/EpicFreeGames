import { ApplicationCommandTypes, InteractionResponseTypes } from "discordeno";

import { embeds } from "~shared/embeds/mod.ts";

import { Command } from "./mod.ts";

export const helpCommand: Command = {
  name: "help",
  description: "Use this if you need help",

  needsGuild: false,
  type: ApplicationCommandTypes.ChatInput,

  execute: async ({ bot, i, lang }) =>
    await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        embeds: [embeds.commands.help(lang)],
      },
    }),
};
