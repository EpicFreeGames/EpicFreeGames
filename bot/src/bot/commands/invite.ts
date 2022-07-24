import {
  ApplicationCommandTypes,
  InteractionResponseTypes,
} from "https://deno.land/x/discordeno@13.0.0-rc45/mod.ts";
import { embeds } from "../../embeds/mod.ts";
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
