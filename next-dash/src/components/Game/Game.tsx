import { ReactNode } from "react";
import { useHasPerms } from "~hooks/useHasPerms";
import { Flags } from "~utils/api/flags";
import { useEditGameMutation } from "~utils/api/games/editGame";
import { IGame } from "~utils/api/types";
import { DeleteGame } from "./DeleteGame";
import { EditGame } from "./EditGame";

export const Game = ({ game }: { game: IGame }) => {
  const canEdit = useHasPerms(Flags.EditGames);
  const canDelete = useHasPerms(Flags.DeleteGames);

  return (
    <div className="bg-gray-700 p-3 rounded-md flex flex-col gap-3">
      <div className="flex gap-2 justify-between w-full flex-col halfMax:flex-row items-start">
        <h2 className="bg-gray-800 py-2 px-3 rounded-md text-lg halfMax:text-2xl">
          {game.displayName}
        </h2>

        <div className="flex gap-1 p-2 bg-gray-800 rounded-lg">
          <Confirmed game={game} />
          {canEdit && <EditGame game={game} />}
          {canDelete && <DeleteGame game={game} />}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 lg:flex-row lg:items-start">
        <img
          className="w-full max-w-[16rem] rounded-md"
          src={game.imageUrl}
          alt={game.displayName}
        />

        <div className="flex flex-col gap-2 w-full halfMax:flex-row">
          <div className="flex flex-col gap-2">
            <Spec title="Name:" value={game.name} wordWrap />
            <Spec title="Path:" value={game.path} />
            <Spec title="Sale starts:" value={game.start} />
            <Spec title="Sale ends:" value={game.end} />
          </div>

          <div className="w-full">
            <Details summary="Prices">
              <div className="grid grid-cols-3 gap-2">
                {game.prices.map((price) => (
                  <div className="bg-gray-700 p-2 rounded-md" key={price.currencyCode}>
                    <p>
                      <b>{price.currencyCode}:</b> {price.formattedValue}
                    </p>
                  </div>
                ))}
              </div>
            </Details>
          </div>
        </div>
      </div>
    </div>
  );
};

const Confirmed = ({ game }: { game: IGame }) => {
  const { mutateAsync } = useEditGameMutation();
  const canEdit = useHasPerms(Flags.EditGames);

  return (
    <button
      className={`h-full btnBase px-2 hover:bg-gray-700/80 active:bg-gray-700/60 ${
        game.confirmed ? "text-green-500" : "text-red-500"
      }`}
      onClick={() =>
        canEdit && mutateAsync({ gameId: game.id, updateData: { confirmed: !game.confirmed } })
      }
    >
      {game.confirmed ? "Confirmed" : "Not confirmed"}
    </button>
  );
};

const Spec = ({ title, value, wordWrap }: { title: string; value: string; wordWrap?: boolean }) => (
  <p className={`bg-gray-800 p-3 rounded-md ${wordWrap ? "" : "whitespace-nowrap"}`}>
    <b className="text-[17px]">{title}</b> <br /> {value}
  </p>
);

const Details = ({ children, summary }: { children: ReactNode; summary: string }) => (
  <details className="bg-gray-800 p-3 rounded-md focusVisibleStyles">
    <summary className="p-1 rounded-md focusVisibleStyles">
      <b className="text-[17px]">{summary}</b>
    </summary>

    <div className="mt-2"></div>

    {children}
  </details>
);
