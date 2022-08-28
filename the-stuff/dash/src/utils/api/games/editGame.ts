import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IGameWithStatus } from "~utils/api/types";

import { ApiError, apiRequest } from "../api";
import { GameContext } from "./_sharedTypes";

export type EditGameProps = {
  gameId: string;
  updateData: Partial<IGameWithStatus>;
};

const editGameRequest = ({ gameId, updateData }: EditGameProps) =>
  apiRequest<IGameWithStatus>({
    path: `/games/${gameId}`,
    method: "PATCH",
    body: updateData,
  });

export const useEditGameMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<IGameWithStatus, ApiError, EditGameProps, GameContext>(
    editGameRequest,
    {
      onSuccess: () => qc.invalidateQueries(["games"]),
    }
  );

  return mutation;
};
