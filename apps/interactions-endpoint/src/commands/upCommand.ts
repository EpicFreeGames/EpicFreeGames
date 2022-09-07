import { embeds } from "@efg/embeds";
import { IGame } from "@efg/types";

import { efgApi } from "../utils/efgApi/efgApi";
import { interactionReply } from "../utils/interactions/responding/interactionReply";
import { SlashCommand } from "../utils/interactions/types";

export const upCommand: SlashCommand = {
  needsGuild: false,
  needsManageGuild: false,
  execute: async ({ i, server, language, currency }, res) => {
    const { error, data: games } = await efgApi<IGame[]>({
      method: "GET",
      path: "/games/up",
    });

    return interactionReply(
      {
        embeds: error
          ? [embeds.errors.genericError()]
          : games.length
          ? games.map((g) => embeds.games.game(g, language, currency))
          : [embeds.games.noUpcomingGames(language)],
      },
      res
    );
  },
};
