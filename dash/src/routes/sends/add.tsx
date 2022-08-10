/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";
import { BackButton } from "~components/Layout/BackButton.tsx";
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
    const gameIds = formData.getAll("gameIds");

    const { error } = await api<IGame>({
      method: "POST",
      path: "/sends",
      body: JSON.stringify({ gameIds }),
      auth: ctx.state.auth,
    });

    if (error) return error;

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/sends",
      },
    });
  },
};

export default function AddSendingPage({ data: games, url }: PageProps<IGame[]>) {
  return (
    <Layout
      title="Add a sending"
      titleButtons={[<BackButton href="/sends" />]}
      url={url}
      segments={["Games", "Add a sending"]}
    >
      <div className={tw`bg-gray-700 rounded-md mx-auto max-w-[400px] p-3`}>
        <form className={tw`flex flex-col gap-3`} method="POST">
          <p>Select games</p>

          <select
            className={tw`appearance-none bg-gray-600 rounded-md p-2 focusStyles duration-200`}
            name="gameIds"
            label="Games"
            required
            multiple
          >
            {games?.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>

          <div className={tw`flex gap-2 justify-between items-center`}>
            <a className={tw`btn-light-gray`} href="/sends">
              Cancel
            </a>

            <button className={tw`btn-blue-border`}>Add</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
