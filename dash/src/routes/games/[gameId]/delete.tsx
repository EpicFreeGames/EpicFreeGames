/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";
import { BackButton } from "../../../components/BackButton.tsx";
import { Layout } from "../../../components/Layout.tsx";
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

    if (error) return error;

    return ctx.render(game);
  },
  POST: async (_req, ctx) => {
    const gameId = ctx.params.gameId;

    const { error } = await api<IGame>({
      method: "DELETE",
      path: `/games/${gameId}`,
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

export default function DeleteGamePage({ data: game, url }: PageProps<IGame>) {
  return (
    <Layout
      title="Delete a game"
      titleButton={<BackButton href="/games" />}
      url={url}
      segments={["Games", game.displayName, "Delete"]}
    >
      <div className={tw`flex flex-col gap-4 bg-gray-700 rounded-md mx-auto max-w-[400px] p-3`}>
        <h2>
          Are you sure you want to delete{" "}
          <b className={tw`whitespace-nowrap`}>{game.displayName}</b>?
        </h2>

        <form className={`flex gap-4 justify-between items-center`} method="POST">
          <a className={tw`btn bg-gray-600`} href="/games">
            Cancel
          </a>

          <button
            type="submit"
            className={tw`btn bg-red-500 bg-opacity-50 border-1 border-red-500`}
          >
            Delete
          </button>
        </form>
      </div>
    </Layout>
  );
}
