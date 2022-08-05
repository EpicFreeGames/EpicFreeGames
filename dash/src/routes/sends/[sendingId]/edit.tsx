/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";
import { BackButton } from "~components/Layout/BackButton.tsx";
import { Layout } from "~components/Layout/Layout.tsx";
import { api } from "~utils/api.ts";
import { Handlers } from "~utils/freshTypes.ts";
import { IGame, ISending } from "../../../types.ts";
import { getGameNames } from "../../../utils/string.tsx";

type PagePropsData = {
  sending: ISending;
  games: IGame[];
};

export const handler: Handlers<PagePropsData> = {
  GET: async (_req, ctx) => {
    const sendingId = ctx.params.sendingId;

    const { error, data: sending } = await api<ISending>({
      method: "GET",
      path: `/sends/${sendingId}`,
      auth: ctx.state.auth,
    });

    if (error) return error;

    const { error: error2, data: games } = await api<IGame[]>({
      method: "GET",
      path: "/games",
      auth: ctx.state.auth,
    });

    if (error2) return error2;

    return ctx.render({ sending, games });
  },
  POST: async (req, ctx) => {
    const sendingId = ctx.params.sendingId;
    const formData = await req.formData();

    const gameIds = formData.getAll("gameIds");

    const { error } = await api<ISending>({
      method: "PATCH",
      path: `/sends/${sendingId}`,
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

export default function EditGamePage({ data: { sending, games }, url }: PageProps<PagePropsData>) {
  return (
    <Layout
      title="Edit a sending"
      titleButtons={[<BackButton href="/sends" />]}
      url={url}
      segments={["Sends", sending.id, "Edit"]}
    >
      <div className={tw`bg-gray-700 rounded-md mx-auto max-w-[400px] p-3`}>
        <h2 className={tw`text-2xl mb-2`}>Edit sending with {getGameNames(games)}</h2>

        <form className={tw`flex flex-col gap-3`} method="POST">
          <p>Select games</p>

          <select
            className={tw`bg-transparent appearance-none`}
            name="gameIds"
            label="Games"
            defaultValue={sending.games?.map((g) => g.name).join(",")}
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
            <a className={tw`btn bg-gray-600`} href="/games">
              Cancel
            </a>

            <button className={tw`btn bg-gray-800 bg-opacity-50 border-1 border-gray-500`}>
              Save
            </button>
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