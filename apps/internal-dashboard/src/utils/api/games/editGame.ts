import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IGameWithStuff } from "@efg/types";

import { ApiError, apiRequest } from "../api";
import { GameContext } from "./_sharedTypes";

export type EditGameProps = {
  gameId: string;
  updateData: Partial<IGameWithStuff>;
};

const editGameRequest = ({ gameId, updateData }: EditGameProps) =>
  apiRequest<IGameWithStuff>({
    path: `/games/${gameId}`,
    method: "PATCH",
    body: updateData,
  });

export const useEditGameMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<IGameWithStuff, ApiError, EditGameProps, GameContext>(
    editGameRequest,
    {
      onSuccess: () => qc.invalidateQueries(["games"]),
    }
  );

  return mutation;
};
