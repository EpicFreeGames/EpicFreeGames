/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { ComponentChildren, h } from "preact";
import { tw } from "twind";
import { Layout } from "../../../components/layout.tsx";
import { Game } from "../../../types.ts";
import { api } from "../../../utils/api.ts";
import { Handlers } from "../../../utils/freshTypes.ts";

export const handler: Handlers<Game[]> = {
  GET: async (_req, ctx) => {
    const { error, data: games } = await api<Game[]>({
      method: "GET",
      path: "/games",
      auth: ctx.state.auth,
    });

    if (error)
      return new Response(
        JSON.stringify({
          error: error?.message,
        }),
        { status: Number(error?.status ?? 500) }
      );

    return ctx.render(games);
  },
};

export default function GamesPage({ data }: PageProps<Game[] | null>) {
  if (!data) return null;

  return (
    <Layout title="Games">
      <div className={tw`flex gap-2 justify-between`}>
        <h1 className={tw`text-4xl`}>Games</h1>

        <a className={tw`px-3 py-2 bg-gray-700 rounded-md`} href="/dash/games/add">
          Add a game
        </a>
      </div>

      <div className={tw`flex flex-col gap-3`}>
        {data.map((game) => (
          <Game key={game.name} game={game} />
        ))}
      </div>
    </Layout>
  );
}

const Game = ({ game }: { game: Game }) => {
  return (
    <div className={tw`bg-gray-700 p-3 rounded-md flex flex-col gap-3`}>
      <div className={tw`flex gap-2 justify-between w-full`}>
        <h2 className={tw`bg-gray-800 p-3 rounded-md text-2xl`}>{game.displayName}</h2>

        <Confirmed confirmed={game.confirmed} />
      </div>

      <div className={tw`flex gap-2`}>
        <img
          className={tw`max-w-[16rem] max-h-[16rem] object-cover`}
          src={game.imageUrl}
          alt={game.displayName}
        />

        <div className={tw`flex gap-2 w-full`}>
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
    } bg-gray-800 p-3 rounded-md text-[17px] flex items-center`}
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
