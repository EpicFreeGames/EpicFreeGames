import { ApplicationCommandTypes, InteractionResponseTypes } from "discordeno";

import { embeds } from "~shared/embeds/mod.ts";

import { Command } from "./mod.ts";

export const voteCommand: Command = {
  name: "vote",
  description: "Vote for me",
  type: ApplicationCommandTypes.ChatInput,
  needsGuild: false,
  execute: ({ bot, i, lang }) =>
    bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        embeds: [embeds.commands.vote(lang)],
      },
    }),
};
