/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";
import { Game } from "../../components/Games/Game.tsx";
import { Layout } from "../../components/layout.tsx";
import { IGame } from "../../types.ts";
import { api } from "../../utils/api.ts";
import { Handlers } from "../../utils/freshTypes.ts";

export const handler: Handlers<IGame[]> = {
  GET: async (_req, ctx) => {
    const { error, data: games } = await api<IGame[]>({
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

export default function GamesPage({ data }: PageProps<IGame[] | null>) {
  if (!data) return null;

  return (
    <Layout title="Games">
      <div className={tw`flex gap-2 justify-between mb-4`}>
        <h1 className={tw`flex justify-center items-center text-3xl md:text-4xl`}>Games</h1>

        <a className={tw`btn bg-gray-700`} href="/games/add">
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
