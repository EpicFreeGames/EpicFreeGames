import { ReactNode } from "react";

import { Flags, IGameWithStuff } from "@efg/types";

import { useHasFlags } from "~hooks/useHasFlags";
import { useEditGameMutation } from "~utils/api/games/editGame";

import { DeleteGame } from "./DeleteGame";
import { EditGame } from "./EditGame";

export const Game = ({ game }: { game: IGameWithStuff }) => {
  const canEdit = useHasFlags(Flags.EditGames);
  const canDelete = useHasFlags(Flags.DeleteGames);

  return (
    <div className="flex flex-col gap-3 rounded-md bg-gray-700 p-3">
      <div className="flex h-full w-full flex-col items-start justify-between gap-2 md:flex-row">
        <h2 className="rounded-md bg-gray-800 py-2 px-3 text-lg md:text-2xl">{game.displayName}</h2>

        <div className="flex gap-1 rounded-lg bg-gray-800 p-2">
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

        <div className="flex w-full flex-col gap-2 md:grid md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Spec title="Name:" value={game.name} wordWrap />
            <Spec
              title="Path:"
              value={
                <a
                  className="border-b-2 border-blue-400/40 text-blue-400 transition-all duration-200 hover:border-blue-400"
                  href={game.webLink}
                  target="_blank"
                >
                  {game.path}
                </a>
              }
            />
            <Spec title="Sale starts:" value={game.start} />
            <Spec title="Sale ends:" value={game.end} />
            <Spec title="Status:" value={game.status} />
          </div>

          <div className="w-full">
            <Details summary="Prices">
              <div className="flex flex-col gap-2">
                {game.prices.map((price) => (
                  <div className="rounded-md bg-gray-700 p-2" key={price.currencyCode}>
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

const Confirmed = ({ game }: { game: IGameWithStuff }) => {
  const { mutateAsync } = useEditGameMutation();
  const canEdit = useHasFlags(Flags.EditGames);

  return (
    <button
      className={`btnBase h-full whitespace-nowrap px-2 hover:bg-gray-700/80 active:bg-gray-700/60 ${
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

const Spec = ({
  title,
  value,
  wordWrap,
}: {
  title: string;
  value: ReactNode;
  wordWrap?: boolean;
}) => (
  <p className={`rounded-md bg-gray-800 p-3 ${wordWrap ? "" : "whitespace-nowrap"}`}>
    <b className="text-[17px]">{title}</b> <br /> {value}
  </p>
);

const Details = ({ children, summary }: { children: ReactNode; summary: string }) => (
  <details className="focusVisibleStyles rounded-md bg-gray-800 p-3">
    <summary className="focusVisibleStyles rounded-md p-1">
      <b className="text-[17px]">{summary}</b>
    </summary>

    <div className="mt-2"></div>

    {children}
  </details>
);
