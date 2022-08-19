/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";

import { BackButton } from "~components/Layout/BackButton.tsx";
import { Layout } from "~components/Layout/Layout.tsx";
import { api } from "~utils/api.ts";
import { Handlers } from "~utils/freshTypes.ts";

import { IGame } from "../../../types.ts";

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
      titleButtons={[<BackButton href="/games" />]}
      url={url}
      segments={["Games", game.displayName, "Delete"]}
    >
      <div className={tw`mx-auto flex max-w-[400px] flex-col gap-4 rounded-md bg-gray-700 p-3`}>
        <h2>
          Are you sure you want to delete{" "}
          <b className={tw`whitespace-nowrap`}>{game.displayName}</b>?
        </h2>

        <form className={`flex items-center justify-between gap-4`} method="POST">
          <a className={tw`btn-light-gray`} href="/games">
            Cancel
          </a>

          <button type="submit" className={tw`btn-red-border`}>
            Delete
          </button>
        </form>
      </div>
    </Layout>
  );
}
