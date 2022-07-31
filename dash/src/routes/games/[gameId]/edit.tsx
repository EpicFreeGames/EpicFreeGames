/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";
import { Input } from "../../../components/Input.tsx";
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

export default function EditGamePage({ data: game }: PageProps<IGame>) {
  return (
    <Layout title="Edit game">
      <div className={tw`flex gap-2 justify-between mb-3`}>
        <h1 className={tw`text-4xl`}>Edit game</h1>

        <a className={tw`btn bg-gray-700`} href="/games">
          Back to games
        </a>
      </div>

      <div className={tw`bg-gray-700 rounded-md mx-auto max-w-[400px] p-3`}>
        <h2 className={tw`text-2xl mb-2`}>
          Edit <b>{game.displayName}</b>
        </h2>

        <form className={tw`flex flex-col gap-3`} method="POST">
          <Input name="name" label="Name" defaultValue={game?.name} required />
          <Input
            name="displayName"
            label="Display name"
            defaultValue={game?.displayName}
            required
          />
          <Input name="path" label="Path" defaultValue={game?.path} required />
          <Input name="imageUrl" label="Image URL" defaultValue={game?.imageUrl} required />
          <Input
            name="start"
            label="Sale starts"
            type="datetime-local"
            defaultValue={getHtmlDate(game?.start)}
            required
          />
          <Input
            name="end"
            label="Sale ends"
            type="datetime-local"
            defaultValue={getHtmlDate(game?.end)}
            required
          />

          <div className={tw`flex gap-2 justify-between items-center`}>
            <a className={tw`btn bg-gray-600`} href="/games">
              Cancel
            </a>

            <button className={tw`btn bg-gray-800`}>Save changes</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

const getHtmlDate = (date: string) => {
  const [start, end] = new Date(date).toISOString().split("T");

  return `${start}T${end.slice(0, 5)}`;
};
