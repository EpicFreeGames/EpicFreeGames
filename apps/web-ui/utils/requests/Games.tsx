import { IGame } from "shared";
import { toast } from "react-hot-toast";
import { request } from ".";
import { mutate } from "swr";
import { IUpdateGameValues } from "../validation/Games";

export const confirmGame = async (game: IGame, currentNotConfirmedGames?: IGame[]) =>
  toast.promise<IGame[]>(
    (async () => {
      await request<IGame>({
        path: `/games/${game._id}`,
        method: "PATCH",
        body: {
          confirmed: true,
        },
      });

      mutate("/games/free");
      mutate("/games/upcoming");

      const filtered = currentNotConfirmedGames?.filter((g) => g._id !== game._id) || [];
      return filtered;
    })(),
    {
      error: `Failed to confirm ${game.name}`,
      success: `Confirmed ${game.name}`,
      loading: `Confirming ${game.name}`,
    }
  );

export const updateGame = async (
  game: IGame,
  updatedGame: IUpdateGameValues,
  currentNotConfirmedGames?: IGame[]
) =>
  toast.promise<IGame[]>(
    (async () => {
      await request<IGame>({
        path: `/games/${game._id}`,
        method: "PATCH",
        body: updatedGame,
      });

      mutate("/games/free");
      mutate("/games/upcoming");
      mutate("/games/not-confirmed");

      const filtered = currentNotConfirmedGames?.filter((g) => g._id !== game._id) || [];
      return filtered;
    })(),
    {
      error: `Failed to update ${game.name}`,
      success: `Updated ${game.name}`,
      loading: `Updating ${game.name}`,
    }
  );

export const removeGame = async (game: IGame) =>
  toast.promise(
    (async () => {
      await request<IGame>({
        path: `/games/${game._id}`,
        method: "DELETE",
      });

      mutate("/games/free");
      mutate("/games/upcoming");
      mutate("/games/not-confirmed");
    })(),
    {
      error: `Failed to remove ${game.name}`,
      success: `Removed ${game.name}`,
      loading: `Removing ${game.name}`,
    }
  );
