import { IGame } from "shared";
import { toast } from "react-hot-toast";
import { request } from ".";
import { mutate } from "swr";

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

export const unConfirmGame = async (game: IGame, currentNotConfirmedGames?: IGame[]) =>
  toast.promise<IGame[]>(
    (async () => {
      await request<IGame>({
        path: `/games/${game._id}`,
        method: "PATCH",
        body: {
          confirmed: false,
        },
      });

      mutate("/games/free");
      mutate("/games/upcoming");

      const filtered = currentNotConfirmedGames?.filter((g) => g._id !== game._id) || [];
      return filtered;
    })(),
    {
      error: `Failed to unconfirm ${game.name}`,
      success: `Unconfirmed ${game.name}`,
      loading: `Unconfirming ${game.name}`,
    }
  );
