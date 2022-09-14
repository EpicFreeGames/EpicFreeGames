import { MessageFlags, RESTPostAPIWebhookWithTokenJSONBody } from "discord-api-types/v10";

import { embeds } from "@efg/embeds";
import { discordApi, displayRole } from "@efg/shared-utils";

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

    discordApi(
      {
        method: "POST",
        path: `/webhooks/${server.webhookId}/${server.webhookToken}`,
        body: {
          ...(server.roleId ? { content: displayRole(server.roleId) } : {}),
          embeds: [{ title: "Testing", description: "Testing testing..." }],
        } as RESTPostAPIWebhookWithTokenJSONBody,
      },
      { useProxy: false }
    )
      .then(() => interactionReply({ content: "✅", flags: MessageFlags.Ephemeral }, res))
      .catch((err) => interactionReply({ content: "❌", flags: MessageFlags.Ephemeral }, res));
  },
};
