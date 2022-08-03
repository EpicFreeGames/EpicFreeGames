import {
  ApplicationCommandTypes,
  InteractionResponseTypes,
  sendInteractionResponse,
} from "https://deno.land/x/discordeno@13.0.0-rc45/mod.ts";
import { displayRole } from "../../sender/utils.ts";
import { embeds } from "../../_shared/embeds/mod.ts";
import { executeWebhook } from "../../_shared/utils/webhook.ts";
import { Command } from "./mod.ts";
export const testCommand: Command = {
  name: "test",
  description: "Send a test notification",
  type: ApplicationCommandTypes.ChatInput,
  needsGuild: true,
  needsManageGuild: true,
  execute: async ({ bot, i, lang, server }) => {
    // server must have a set channel
    if (!server?.webhookId || !server?.webhookToken)
      return await sendInteractionResponse(bot, i.id, i.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          embeds: [embeds.errors.channelNotSet(lang)],
        },
      });

    const role = displayRole(server.roleId);

    await executeWebhook(bot, {
      id: server.webhookId,
      token: server.webhookToken,
      threadId: server.threadId,
      options: {
        ...(role ? { content: role } : {}),
        embeds: [{ title: "Test message", description: "Testing testing..." }],
      },
    });
  },
};
