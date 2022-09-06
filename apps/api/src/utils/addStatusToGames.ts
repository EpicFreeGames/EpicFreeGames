import { Game } from "@prisma/client";

import { GameWithStatus } from "../types";

export const addStatusToGame = (game: Game): GameWithStatus => {
  const now = new Date();

  return {
    ...game,
    status: game.start > now ? "up" : game.start < now && game.end > now ? "free" : "gone",
  };
};

export const addStatusToGames = (games: Game[]) => games.map(addStatusToGame);
