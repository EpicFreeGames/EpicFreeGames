import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IGame } from "~types";
import { ApiError, apiRequest } from "../api";

type UpdateGameProps = {
  gameId: string;
  updateData: Partial<IGame>;
};

const updateGame = ({ gameId, updateData }: UpdateGameProps) =>
  apiRequest<IGame>(`/games/${gameId}`, "PATCH", updateData);

export const useGameMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<IGame, ApiError, UpdateGameProps, { prevGames: IGame[] }>(
    updateGame,
    {
      onMutate: async ({ gameId, updateData }) => {
        await qc.cancelQueries(["games"]);

        const prevGames = qc.getQueryData<IGame[]>(["games"]) ?? [];

        qc.setQueryData(
          ["games"],
          prevGames.map((g) => (g.id === gameId ? { ...g, ...updateData } : g))
        );

        return { prevGames };
      },
      onError: (error, gameId, context) => {
        context && qc.setQueryData(["games"], context.prevGames);
      },
      onSettled: () => qc.invalidateQueries(["games"]),
    }
  );

  return mutation;
};
