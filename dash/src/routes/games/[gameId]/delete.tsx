/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";
import { Layout } from "../../../components/layout.tsx";
import { IGame } from "../../../types.ts";
import { api } from "../../../utils/api.ts";
import { Handlers } from "../../../utils/freshTypes.ts";

export const handler: Handlers<IGame> = {
  GET: async (_req, ctx) => {
    const gameId = ctx.params.gameId;

    const { error, data: game } = await api<IGame>({
      method: "GET",
      path: `/games/${gameId}`,
      auth: ctx.state.auth,
    });

    if (error)
      return new Response(
        JSON.stringify({
          error: error?.message,
        }),
        { status: Number(error?.status ?? 500) }
      );

    return ctx.render(game);
  },
  POST: async (_req, ctx) => {
    const gameId = ctx.params.gameId;

    const { error } = await api<IGame>({
      method: "DELETE",
      path: `/games/${gameId}`,
      auth: ctx.state.auth,
    });

    if (error)
      return new Response(
        JSON.stringify({
          error: error?.message,
        }),
        { status: Number(error?.status ?? 500) }
      );

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/games",
      },
    });
  },
};

export default function GameDeletePage({ data: game }: PageProps<IGame>) {
  return (
    <Layout title="Delete game">
      <div className={tw`flex gap-2 justify-between mb-3`}>
        <h1 className={tw`text-4xl`}>Delete game</h1>

        <a className={tw`btn bg-gray-700`} href="/games">
          Back to games
        </a>
      </div>

      <div className={tw`bg-gray-700 rounded-md mx-auto max-w-[400px] p-3`}>
        <h2>
          Are you sure you want to delete <b>{game.displayName}</b>?
        </h2>

        <form className={tw`flex flex-col gap-3`} method="POST">
          <div className={tw`flex gap-2 justify-between mt-4 items-center`}>
            <a className={tw`btn bg-gray-600`} href="/games">
              Cancel
            </a>

            <button type="submit" className={tw`btn bg-red-700`}>
              Delete
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
