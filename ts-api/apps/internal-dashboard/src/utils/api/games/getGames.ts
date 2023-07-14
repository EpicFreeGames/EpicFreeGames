import { useQuery } from "@tanstack/react-query";

import { IGameWithStuff } from "@efg/types";

import { ApiError, apiRequest } from "../api";

const fetchGames = () =>
  apiRequest<IGameWithStuff[]>({
    path: "/games",
    method: "GET",
  });

export const useGames = () => useQuery<IGameWithStuff[], ApiError>(["games"], fetchGames);

const fetchConfirmedGames = () =>
  apiRequest<IGameWithStuff[]>({
    path: "/games/confirmed",
    method: "GET",
  });

export const useConfirmedGames = () =>
  useQuery<IGameWithStuff[], ApiError>(["games"], fetchConfirmedGames);
