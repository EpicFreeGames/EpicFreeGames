import { useMutation } from "@tanstack/react-query";
import { ApiError, apiRequest } from "../api";
import { GameContext } from "./_sharedTypes";

type DeleteGameProps = {
  gameId: string;
};

const deleteGameRequest = ({ gameId }: DeleteGameProps) =>
  apiRequest<void>(`/games/${gameId}`, "DELETE");

export const useDeleteGameMutation = () => {
  const mutation = useMutation<void, ApiError, DeleteGameProps, GameContext>(deleteGameRequest);

  return mutation;
};
