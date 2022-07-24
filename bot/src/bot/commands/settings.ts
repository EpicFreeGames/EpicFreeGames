import {
  ApplicationCommandTypes,
  InteractionResponseTypes,
} from "https://deno.land/x/discordeno@13.0.0-rc45/mod.ts";
import { embeds } from "../../embeds/mod.ts";
import { bot } from "../mod.ts";
import { Command, EphemeralFlag } from "./mod.ts";

export const settingsCommand: Command = {
  name: "settings",
  description: "See the settings",
  needsGuild: true,
  type: ApplicationCommandTypes.ChatInput,
  needsManageGuild: true,
  execute: ({ i, server, lang, curr }) =>
    bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        flags: EphemeralFlag,
        embeds: [embeds.commands.settings(server, lang, curr)],
      },
    }),
};
