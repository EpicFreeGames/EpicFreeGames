import { useQuery } from "@tanstack/react-query";

import { IGame } from "~utils/api/types";

import { ApiError, apiRequest } from "../api";

const fetchGames = () =>
  apiRequest<IGame[]>({
    path: "/games",
    method: "GET",
  });

export const useGames = () => useQuery<IGame[], ApiError>(["games"], fetchGames);
