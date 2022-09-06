import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IGameWithStatus } from "~utils/api/types";

import { ApiError, apiRequest } from "../api";
import { GameContext } from "./_sharedTypes";

export type AddGameProps = Omit<IGameWithStatus, "id" | "sendingId" | "prices"> & {
  usdPrice: string;
  priceValue: number;
};

const addGameRequest = (props: AddGameProps) =>
  apiRequest<IGameWithStatus>({
    path: "/games",
    method: "POST",
    body: props,
  });

export const useAddGameMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<IGameWithStatus, ApiError, AddGameProps, GameContext>(
    addGameRequest,
    {
      onSuccess: () => {
        qc.invalidateQueries(["games"]);
      },
    }
  );

  return mutation;
};
