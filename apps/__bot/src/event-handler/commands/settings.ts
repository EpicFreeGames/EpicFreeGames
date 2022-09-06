import { ApplicationCommandTypes, InteractionResponseTypes } from "discordeno";

import { embeds } from "~shared/embeds/mod.ts";

import { Command, EphemeralFlag } from "./mod.ts";

export const settingsCommand: Command = {
  name: "settings",
  description: "See the settings",
  needsGuild: true,
  type: ApplicationCommandTypes.ChatInput,
  needsManageGuild: true,
  execute: ({ bot, i, server, lang, curr }) =>
    bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        flags: EphemeralFlag,
        embeds: [embeds.commands.settings(server, lang, curr)],
      },
    }),
};
