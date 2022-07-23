import { ApplicationCommandTypes, BitwisePermissionFlags } from "discordeno";
import { replyToInteraction } from "../utils/interactionReply.ts";
import { Command } from "./mod.ts";

export const pingCommand: Command = {
  name: "ping",
  description: "Ping!",
  needsGuild: false,
  type: ApplicationCommandTypes.ChatInput,
  neededPermissions: BitwisePermissionFlags.MANAGE_GUILD,
  execute: async ({ bot, i }) => {
    await replyToInteraction(bot, i, {
      content: "Pong!",
    });
  },
};
