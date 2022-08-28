import { Game } from "@prisma/client";

import { GameStatus, GameWithStatus } from "../types";

export const addStatusToGames = (...games: Game[]): GameWithStatus[] => {
  const now = new Date();

  return games.map((game) => {
    let status: GameStatus = "up";

    if (game.start > now) {
      status = "up";
    } else if (game.end > now) {
      status = "free";
    } else {
      status = "gone";
    }

    const newGame = { ...game, status };

    return newGame;
  });
};
