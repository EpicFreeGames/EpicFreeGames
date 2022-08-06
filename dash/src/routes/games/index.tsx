/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { Edit, Trash } from "icons";
import { ComponentChildren, h } from "preact";
import { tw } from "twind";
import { Layout } from "~components/Layout/Layout.tsx";
import { api } from "~utils/api.ts";
import { Handlers } from "~utils/freshTypes.ts";
import { IGame } from "../../types.ts";

export const handler: Handlers<IGame[]> = {
  GET: async (_req, ctx) => {
    const { error, data: games } = await api<IGame[]>({
      method: "GET",
      path: "/games",
      auth: ctx.state.auth,
    });

    if (error) return error;

    return ctx.render(games);
  },
  POST: async (req, ctx) => {
    const formData = await req.formData();
    const gameId = formData.get("gameId");

    const { error } = await api<IGame>({
      method: "POST",
      path: `/games/${gameId}/toggle-confirmed`,
      auth: ctx.state.auth,
    });

    if (error) return error;

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/games",
      },
    });
  },
};

export default function GamesPage({ data, url }: PageProps<IGame[] | null>) {
  if (!data) return null;

  return (
    <Layout
      title="Games"
      titleButtons={[
        <a className={tw`btn-gray`} href="/games/add">
          Add a game
        </a>,
      ]}
      url={url}
      segments={["Games"]}
    >
      <div className={tw`flex flex-col gap-3`}>
        {data.map((game) => (
          <Game key={game.name} game={game} />
        ))}
      </div>
    </Layout>
  );
}

const Game = ({ game }: { game: IGame }) => {
  return (
    <div className={tw`bg-gray-700 p-3 rounded-md flex flex-col gap-3`}>
      <div className={tw`flex gap-2 justify-between w-full flex-col halfMax:flex-row`}>
        <h2 className={tw`bg-gray-800 py-2 px-3 rounded-md text-lg halfMax:text-2xl`}>
          {game.displayName}
        </h2>

        <div className={tw`flex gap-2 justify-between`}>
          <Confirmed game={game} />

          <div className={tw`flex gap-2 justify-end`}>
            <a className={tw`btn-dark-gray`} href={`/games/${game.id}/edit`}>
              <Edit size={25} />
            </a>
            <a className={tw`btn-dark-gray`} href={`/games/${game.id}/delete`}>
              <Trash size={25} className={tw`text-red-500`} />
            </a>
          </div>
        </div>
      </div>

      <div className={tw`flex flex-col items-center gap-2 lg:flex-row lg:items-start`}>
        <img
          className={tw`w-full max-w-[16rem] rounded-md`}
          src={game.imageUrl}
          alt={game.displayName}
        />

        <div className={tw`flex flex-col gap-2 w-full halfMax:flex-row`}>
          <div className={tw`flex flex-col gap-2`}>
            <Spec title="Name:" value={game.name} wordWrap />
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

const Confirmed = ({ game }: { game: IGame }) => (
  <form method="POST">
    <input type="hidden" name="gameId" value={game.id} />
    <button
      className={tw`btn-dark-gray ${game.confirmed ? "text-green-500" : "text-red-500"} h-full`}
    >
      {game.confirmed ? "Confirmed" : "Not confirmed"}
    </button>
  </form>
);

const Spec = ({ title, value, wordWrap }: { title: string; value: string; wordWrap?: boolean }) => (
  <p className={tw`bg-gray-800 p-3 rounded-md ${wordWrap ? "" : "whitespace-nowrap"}`}>
    <b className={tw`text-[17px]`}>{title}</b> <br /> {value}
  </p>
);

const Details = ({ children, summary }: { children: ComponentChildren; summary: string }) => (
  <details className={tw`bg-gray-800 p-3 rounded-md focusVisibleStyles`}>
    <summary className={tw`p-1 rounded-md focusVisibleStyles`}>
      <b className={tw`text-[17px]`}>{summary}</b>
    </summary>

    <div className={tw`mt-2`}></div>

    {children}
  </details>
);
