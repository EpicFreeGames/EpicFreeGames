import {
  APIChatInputApplicationCommandGuildInteraction,
  MessageFlags,
} from "discord-api-types/v10";
import { Response } from "express";

import { embeds } from "@efg/embeds";
import { ICurrency, ILanguage, IServer } from "@efg/types";

import { efgApi } from "../../utils/efgApi/efgApi";
import { interactionReply } from "../../utils/interactions/responding/interactionReply";

export const removeRoleSubCommand = async (
  {
    i,
    server,
    language,
    currency,
  }: {
    i: APIChatInputApplicationCommandGuildInteraction;
    server?: IServer;
    language: ILanguage;
    currency: ICurrency;
  },
  res: Response
) => {
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
};
