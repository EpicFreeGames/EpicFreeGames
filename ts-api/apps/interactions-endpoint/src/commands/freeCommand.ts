import { embeds } from "@efg/embeds";
import { efgApi } from "@efg/shared-utils";
import { IGameWithStuff } from "@efg/types";

import { interactionReply } from "../utils/interactions/responding/interactionReply";
import { SlashCommand } from "../utils/interactions/types";

export const freeCommand: SlashCommand = {
  needsGuild: false,
  needsManageGuild: false,
  execute: async ({ i, server, language, currency }, res) => {
    const { error, data: games } = await efgApi<IGameWithStuff[]>({
      method: "GET",
      path: "/games/free",
    });

    return interactionReply(
      {
        embeds: error
          ? [embeds.errors.genericError()]
          : games.length
          ? games.map((g) => embeds.games.game(g, language, currency))
          : [embeds.games.noFreeGames(language)],
      },
      res
    );
  },
};
