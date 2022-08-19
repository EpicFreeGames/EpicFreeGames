import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IGame } from "~utils/api/types";

import { ApiError, apiRequest } from "../api";
import { GameContext } from "./_sharedTypes";

export type AddGameProps = Omit<IGame, "id" | "sendingId" | "prices"> & {
  usdPrice: string;
  priceValue: number;
};

const addGameRequest = (props: AddGameProps) =>
  apiRequest<IGame>({
    path: "/games",
    method: "POST",
    body: props,
  });

export const useAddGameMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<IGame, ApiError, AddGameProps, GameContext>(addGameRequest, {
    onSuccess: () => {
      qc.invalidateQueries(["games"]);
    },
  });

  return mutation;
};
