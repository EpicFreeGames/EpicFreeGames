import { MessageFlags } from "discord-api-types/v10";

import { embeds } from "@efg/embeds";
import { IServer } from "@efg/types";

import { efgApi } from "../../utils/efgApi/efgApi";
import { interactionReply } from "../../utils/interactions/responding/interactionReply";
import { SlashCommand } from "../../utils/interactions/types";

export const removeRoleCommand: SlashCommand = {
  needsGuild: true,
  needsManageGuild: true,
  execute: async ({ i, server, language, currency }, res) => {
    if (!server?.roleId)
      return interactionReply(
        {
          embeds: [
            embeds.successes.currentSettings(language),
            embeds.commands.settings(server, language, currency),
          ],
          flags: MessageFlags.Ephemeral,
        },
        res
      );

    const { error, data: updatedServer } = await efgApi<IServer>({
      method: "DELETE",
      path: `/servers/${server.id}/role`,
    });

    if (error) {
      console.error(
        `Failed to remove role - Cause: Failed to update server in efgApi - Cause: ${error}`
      );

      return interactionReply({ embeds: [embeds.errors.genericError()] }, res);
    }

    interactionReply(
      {
        embeds: [
          embeds.successes.updatedSettings(language),
          embeds.commands.settings(updatedServer, language, currency),
        ],
        flags: MessageFlags.Ephemeral,
      },
      res
    );
  },
};
