import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IGame } from "~types";
import { ApiError, apiRequest } from "../api";

type DeleteGameProps = {
  gameId: string;
};

const deleteGame = ({ gameId }: DeleteGameProps) => apiRequest<void>(`/games/${gameId}`, "DELETE");

export const useDeleteGameMutation = () => {
  const qc = useQueryClient();
  const mutation = useMutation<void, ApiError, DeleteGameProps, { prevGames: IGame[] }>(
    deleteGame,
    {
      onMutate: async ({ gameId }) => {
        await qc.cancelQueries(["games"]);

        const prevGames = qc.getQueryData<IGame[]>(["games"]) ?? [];

        qc.setQueryData(
          ["games"],
          prevGames.filter((g) => g.id !== gameId)
        );

        return { prevGames };
      },
      onError: (error, props, context) => {
        context && qc.setQueryData(["games"], context.prevGames);
      },
      onSettled: () => qc.invalidateQueries(["games"]),
    }
  );

  return mutation;
};
