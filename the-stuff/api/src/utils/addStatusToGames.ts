import { Game } from "@prisma/client";

import { GameStatus } from "../types";

export const addStatusToGames = (...games: Game[]) => {
  const now = new Date();

  const updatedGames = games.map((game) => {
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

  if (updatedGames.length === 1 && updatedGames[0]) return updatedGames[0];

  return updatedGames;
};
