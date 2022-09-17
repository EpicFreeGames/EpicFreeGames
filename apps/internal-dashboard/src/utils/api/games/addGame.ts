import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IGameWithStuff } from "@efg/types";

import { ApiError, apiRequest } from "../api";
import { GameContext } from "./_sharedTypes";

export type AddGameProps = Omit<IGameWithStuff, "id" | "sendingId" | "prices"> & {
  usdPrice: string;
  priceValue: number;
};

const addGameRequest = (props: AddGameProps) =>
  apiRequest<IGameWithStuff>({
    path: "/games",
    method: "POST",
    body: props,
  });

export const useAddGameMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<IGameWithStuff, ApiError, AddGameProps, GameContext>(
    addGameRequest,
    {
      onSuccess: () => {
        qc.invalidateQueries(["games"]);
      },
    }
  );

  return mutation;
};
