import { embeds } from "@efg/embeds";

import { interactionReply } from "../utils/interactions/responding/interactionReply";
import { SlashCommand } from "../utils/interactions/types";

export const command: SlashCommand = {
  needsManageGuild: true,
  needsGuild: true,
  execute: async ({ i, server, language, currency }, res) =>
    interactionReply(
      {
        embeds: [embeds.commands.settings(server, language, currency)],
      },
      res
    ),
};
