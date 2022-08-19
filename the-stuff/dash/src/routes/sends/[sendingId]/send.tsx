/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";

import { BackButton } from "~components/Layout/BackButton.tsx";
import { Layout } from "~components/Layout/Layout.tsx";
import { api } from "~utils/api.ts";
import { Handlers } from "~utils/freshTypes.ts";
import { arrayToCoolString } from "~utils/string.tsx";

import { ISending } from "../../../types.ts";

export const handler: Handlers<ISending> = {
  GET: async (_req, ctx) => {
    const sendingId = ctx.params.sendingId;

    const { error, data: game } = await api<ISending>({
      method: "GET",
      path: `/sends/${sendingId}`,
      auth: ctx.state.auth,
    });

    if (error) return error;

    return ctx.render(game);
  },
  POST: async (_req, ctx) => {
    const sendingId = ctx.params.sendingId;

    const { error } = await api<ISending>({
      method: "POST",
      path: `/sends/${sendingId}/send`,
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
export default function SendsSendPage({ data: sending, url }: PageProps<ISending>) {
  const gameNames = sending.games?.map((g) => g.name) ?? [];

  return (
    <Layout
      title="Start sending"
      titleButtons={[<BackButton href="/sends" />]}
      url={url}
      segments={["Sends", sending.id, "Send"]}
    >
      <div className={tw`mx-auto flex max-w-[400px] flex-col gap-4 rounded-md bg-gray-700 p-3`}>
        <h2>
          Are you sure you want to start sending <b>{arrayToCoolString(gameNames)}</b>?
        </h2>

        <form className={`flex items-center justify-between gap-4`} method="POST">
          <a className={tw`btn-light-gray`} href="/sends">
            Cancel
          </a>

          <button type="submit" className={tw`btn-blue-border`}>
            Yes, start sending
          </button>
        </form>
      </div>
    </Layout>
  );
}
