import { embeds } from "@efg/embeds";

import { interactionReply } from "../utils/interactions/responding/interactionReply";
import { SlashCommand } from "../utils/interactions/types";

export const command: SlashCommand = {
  needsGuild: true,
  needsManageGuild: false,
  execute: async ({ i, server, language, currency }, res) =>
    interactionReply(
      {
        embeds: [embeds.commands.help(language)],
      },
      res
    ),
};
