import { MessageFlags, RESTPostAPIWebhookWithTokenJSONBody } from "discord-api-types/v10";

import { embeds } from "@efg/embeds";
import { displayRole, executeDiscordWebhook } from "@efg/shared-utils";

import { interactionReply } from "../utils/interactions/responding/interactionReply";
import { SlashCommand } from "../utils/interactions/types";

export const testCommand: SlashCommand = {
  needsGuild: true,
  needsManageGuild: true,
  execute: async ({ i, server, language, currency }, res) => {
    if (!server?.channelId || !server.webhookId || !server.webhookToken)
      return interactionReply(
        { embeds: [embeds.errors.channelNotSet(language)], flags: MessageFlags.Ephemeral },
        res
      );

    executeDiscordWebhook({
      webhookId: server.webhookId,
      webhookToken: server.webhookToken,
      threadId: server.threadId,
      body: {
        ...(server.roleId ? { content: displayRole(server.roleId) } : {}),
        embeds: [{ title: "Testing", description: "Testing testing..." }],
      } as RESTPostAPIWebhookWithTokenJSONBody,
    })
      .then(() => interactionReply({ content: "✅", flags: MessageFlags.Ephemeral }, res))
      .catch((err) => interactionReply({ content: "❌", flags: MessageFlags.Ephemeral }, res));
  },
};
