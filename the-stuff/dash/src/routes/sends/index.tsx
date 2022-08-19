/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { Edit, Trash } from "icons";
import { h } from "preact";
import { tw } from "twind";

import { Layout } from "~components/Layout/Layout.tsx";
import { api } from "~utils/api.ts";
import { Handlers } from "~utils/freshTypes.ts";
import { arrayToCoolString } from "~utils/string.tsx";

import { ISending } from "../../types.ts";

export const handler: Handlers<ISending[]> = {
  GET: async (_req, ctx) => {
    const { error, data: games } = await api<ISending[]>({
      method: "GET",
      path: "/sends",
      auth: ctx.state.auth,
    });

    if (error) return error;

    return ctx.render(games);
  },
};

export default function GamesPage({ data: sends, url }: PageProps<ISending[] | null>) {
  if (!sends) return null;

  return (
    <Layout
      title="Sends"
      titleButtons={[
        <a className={tw`btn-gray`} href="/sends/add">
          Add a sending
        </a>,
      ]}
      url={url}
      segments={["Sends"]}
    >
      <div className={tw`flex flex-col gap-3`}>
        {sends.map((sending) => (
          <Sending key={sending.id} sending={sending} />
        ))}
      </div>
    </Layout>
  );
}

type SendingProps = {
  sending: ISending;
};

const Sending = ({ sending }: SendingProps) => {
  const coolString = arrayToCoolString(sending.games?.map((g) => g.name) ?? []);

  const showDelete = sending.status !== "SENDING";
  const showEdit = sending.status !== "SENDING" && sending.status !== "SENT";
  const showSend = showEdit;

  const showButtons = showDelete || showEdit || showSend;

  return (
    <div className={tw`flex flex-col gap-3 rounded-md bg-gray-700 p-3`}>
      <div className={tw`flex w-full flex-wrap justify-between gap-2`}>
        <h2 className={tw`w-max rounded-md bg-gray-800 py-2 px-3 text-lg md:text-2xl`}>
          {sending.id}
        </h2>

        {showButtons && (
          <div className={tw`flex w-max gap-2`}>
            {showEdit && (
              <a
                title="Edit sending"
                className={tw`btn-dark-gray`}
                href={`/sends/${sending.id}/edit`}
              >
                <Edit size={25} />
              </a>
            )}
            {showDelete && (
              <a
                title="Delete sending"
                className={tw`btn-dark-gray`}
                href={`/sends/${sending.id}/delete`}
              >
                <Trash size={25} className={tw`text-red-500`} />
              </a>
            )}
            {showSend && (
              <a title="Send" className={tw`btn-dark-gray`} href={`/sends/${sending.id}/send`}>
                Send
              </a>
            )}
          </div>
        )}
      </div>

      <div className={tw`flex flex-col gap-2`}>
        <p className={tw`rounded-md bg-gray-800 p-3`}>
          <b className={tw`text-[17px]`}>Games:</b> <br />
          {coolString ?? "No games"}
        </p>

        <p className={tw`rounded-md bg-gray-800 p-3`}>
          <b className={tw`text-[17px]`}>Status:</b> <br /> {sending.status}
        </p>
      </div>
    </div>
  );
};
