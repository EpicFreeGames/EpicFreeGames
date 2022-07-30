/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { GameForm } from "../../components/Games/GameForm.tsx";
import { Layout } from "../../components/layout.tsx";
import { IGame } from "../../types.ts";
import { api } from "../../utils/api.ts";
import { Handlers } from "../../utils/freshTypes.ts";

export const handler: Handlers = {
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const { error } = await api<IGame>({
      method: "POST",
      path: "/games",
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
};

export default function AddGamePage() {
  return (
    <Layout title="Add a game">
      <div className={tw`flex gap-2 justify-between mb-3`}>
        <h1 className={tw`text-4xl`}>Add a game</h1>

        <a className={tw`btn bg-gray-700`} href="/games">
          Back to games
        </a>
      </div>

      <GameForm />
    </Layout>
  );
}
