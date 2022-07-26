import { ApplicationCommandTypes, InteractionResponseTypes } from "discordeno";
import { embeds } from "~shared/embeds/mod.ts";
import { Command } from "./mod.ts";

export const inviteCommand: Command = {
  name: "invite",
  description: "Get my invite link",
  type: ApplicationCommandTypes.ChatInput,
  needsGuild: false,
  execute: ({ bot, i, lang }) =>
    bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        embeds: [embeds.commands.invite(lang)],
      },
    }),
};
