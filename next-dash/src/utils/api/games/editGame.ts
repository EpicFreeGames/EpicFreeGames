import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IGame } from "~utils/api/types";
import { ApiError, apiRequest } from "../api";
import { GameContext } from "./_sharedTypes";

export type EditGameProps = {
  gameId: string;
  updateData: Partial<IGame>;
};

const editGameRequest = ({ gameId, updateData }: EditGameProps) =>
  apiRequest<IGame>(`/games/${gameId}`, "PATCH", updateData);

export const useEditGameMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<IGame, ApiError, EditGameProps, GameContext>(editGameRequest, {
    onSuccess: () => qc.invalidateQueries(["games"]),
  });

  return mutation;
};
