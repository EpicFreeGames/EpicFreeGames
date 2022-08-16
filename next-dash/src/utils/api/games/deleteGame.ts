import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, apiRequest } from "../api";
import { GameContext } from "./_sharedTypes";

type DeleteGameProps = {
  gameId: string;
};

const deleteGameRequest = ({ gameId }: DeleteGameProps) =>
  apiRequest<void>({
    path: `/games/${gameId}`,
    method: "DELETE",
  });

export const useDeleteGameMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<void, ApiError, DeleteGameProps, GameContext>(deleteGameRequest, {
    onSuccess: () => {
      qc.invalidateQueries(["games"]);
    },
  });

  return mutation;
};
