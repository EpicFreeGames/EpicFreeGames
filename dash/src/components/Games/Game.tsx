/** @jsx h */
import { Edit, Trash } from "icons";
import { ComponentChildren, h } from "preact";
import { tw } from "twind";
import type { IGame } from "../../types.ts";

export const Game = ({ game }: { game: IGame }) => {
  return (
    <div className={tw`bg-gray-700 p-3 rounded-md flex flex-col gap-3`}>
      <div className={tw`flex gap-2 justify-between w-full flex-col md:flex-row`}>
        <h2 className={tw`bg-gray-800 py-2 px-3 rounded-md text-lg md:text-2xl`}>
          {game.displayName}
        </h2>

        <div className={tw`flex gap-2 justify-between`}>
          <Confirmed confirmed={game.confirmed} />

          <div className={tw`flex gap-2`}>
            <a className={tw`btn bg-gray-800`} href={`/games/${game.id}/edit`}>
              <Edit size={25} />
            </a>
            <a className={tw`btn bg-gray-800`} href={`/games/${game.id}/edit`}>
              <Trash size={25} className={tw`text-red-500`} />
            </a>
          </div>
        </div>
      </div>

      <div className={tw`flex flex-col items-center gap-2 lg:flex-row lg:items-start`}>
        <img
          className={tw`w-full max-w-[16rem] object-scale-down rounded-md`}
          src={game.imageUrl}
          alt={game.displayName}
        />

        <div className={tw`flex flex-col gap-2 w-full md:flex-row`}>
          <div className={tw`flex flex-col gap-2`}>
            <Spec title="Name:" value={game.name} />
            <Spec title="Path:" value={game.path} />
            <Spec title="Sale starts:" value={game.start} />
            <Spec title="Sale ends:" value={game.end} />
          </div>

          <div className={tw`w-full`}>
            <Details summary="Prices">
              <div className={tw`grid grid-cols-3 gap-2`}>
                {game.prices.map((price) => (
                  <div className={tw`bg-gray-700 p-2 rounded-md`}>
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

const Confirmed = ({ confirmed }: { confirmed: boolean }) => (
  <p
    className={tw`${
      confirmed ? "text-green-500" : "text-red-500"
    } bg-gray-800 py-2 px-3 rounded-md text-[17px] flex items-center`}
  >
    {confirmed ? "Confirmed" : "Not confirmed"}
  </p>
);

const Spec = ({ title, value }: { title: string; value: string }) => (
  <p className={tw`bg-gray-800 p-3 rounded-md`}>
    <b className={tw`text-[17px]`}>{title}</b> <br /> {value}
  </p>
);

const Details = ({ children, summary }: { children: ComponentChildren; summary: string }) => (
  <details className={tw`bg-gray-800 p-3 rounded-md`}>
    <summary>
      <b className={tw`text-[17px]`}>{summary}</b>
    </summary>

    <div className={tw`mt-2`}></div>

    {children}
  </details>
);
