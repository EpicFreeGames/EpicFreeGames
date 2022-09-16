import { useQuery } from "@tanstack/react-query";

import { IGameWithStatus } from "~utils/api/types";

import { ApiError, apiRequest } from "../api";

const fetchGames = () =>
  apiRequest<IGameWithStatus[]>({
    path: "/games",
    method: "GET",
  });

export const useGames = () => useQuery<IGameWithStatus[], ApiError>(["games"], fetchGames);

const fetchConfirmedGames = () =>
  apiRequest<IGameWithStatus[]>({
    path: "/games/confirmed",
    method: "GET",
  });

export const useConfirmedGames = () =>
  useQuery<IGameWithStatus[], ApiError>(["games"], fetchConfirmedGames);
