import { Game, GamePrice } from "@prisma/client";

import { configuration } from "@efg/configuration";
import { IGameWithStuff } from "@efg/types";

import { gameStores } from "../data/gameStores";

export const addStufftoGame = (game: Game & { prices: GamePrice[] }): IGameWithStuff => {
  const now = new Date();
  const store = gameStores.find((store) => store.id === game.storeId)!;

  const { start, end, ...restOfGame } = game;

  return {
    ...restOfGame,
    start: start.toISOString(),
    end: end.toISOString(),
    status: game.start > now ? "up" : game.start < now && game.end > now ? "free" : "gone",
    store,
    webLink: `${store.webBaseUrl}${game.path}`,
    appLink: `${store.appBaseUrl}${game.path}`,
    redirectWebUrl: `${configuration.EFG_FRONT_BASEURL}/r/web/${game.id}`,
    redirectAppUrl: store.appBaseUrl ? `${configuration.EFG_FRONT_BASEURL}/r/app/${game.id}` : null,
  };
};

export const addStuffToGames = (games: (Game & { prices: GamePrice[] })[]) =>
  games.map(addStufftoGame).sort((a, b) => (a.start > b.start ? 1 : -1));
