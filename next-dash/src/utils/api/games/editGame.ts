import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IGame } from "~types";
import { ApiError, apiRequest } from "../api";
import { GameContext } from "./_sharedTypes";

export type UpdateGameProps = {
  gameId: string;
  updateData: Partial<IGame>;
};

const editGameRequest = ({ gameId, updateData }: UpdateGameProps) =>
  apiRequest<IGame>(`/games/${gameId}`, "PATCH", updateData);

export const useEditGameMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<IGame, ApiError, UpdateGameProps, GameContext>(editGameRequest, {
    onMutate: async ({ gameId, updateData }) => {
      await qc.cancelQueries(["games"]);

      const prevGames = qc.getQueryData<IGame[]>(["games"]) ?? [];

      qc.setQueryData(
        ["games"],
        prevGames.map((g) => (g.id === gameId ? { ...g, ...updateData } : g))
      );

      return { prevGames };
    },
    onError: (error, props, context) => {
      context && qc.setQueryData(["games"], context.prevGames);
    },
    onSettled: () => qc.invalidateQueries(["games"]),
  });

  return mutation;
};
