/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";
import { GameForm } from "../../../components/Games/GameForm.tsx";
import { Layout } from "../../../components/layout.tsx";
import { IGame } from "../../../types.ts";
import { api } from "../../../utils/api.ts";
import { Handlers } from "../../../utils/freshTypes.ts";

export const handler: Handlers<IGame> = {
  POST: async (req, ctx) => {
    const gameId = ctx.params.gameId;
    const formData = await req.formData();

    const { error } = await api<IGame>({
      method: "PATCH",
      path: `/games/${gameId}`,
      body: JSON.stringify(Object.fromEntries(formData)),
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
};

export default function EditGamePage({ data }: PageProps<IGame>) {
  return (
    <Layout title="Edit game">
      <div className={tw`flex gap-2 justify-between mb-3`}>
        <h1 className={tw`text-4xl`}>Edit {data.displayName}</h1>

        <a className={tw`btn bg-gray-700`} href="/games">
          Back to games
        </a>
      </div>

      <GameForm game={data} />
    </Layout>
  );
}
