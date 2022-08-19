/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";

import { BackButton } from "~components/Layout/BackButton.tsx";
import { Layout } from "~components/Layout/Layout.tsx";
import { api } from "~utils/api.ts";
import { Handlers } from "~utils/freshTypes.ts";

import { ICurrency } from "../../../types.ts";

export const handler: Handlers<ICurrency> = {
  GET: async (_req, ctx) => {
    const currencyId = ctx.params.currencyId;

    const { error, data: currency } = await api<ICurrency>({
      method: "GET",
      path: `/currencies/${currencyId}`,
      auth: ctx.state.auth,
    });

    if (error) return error;

    return ctx.render(currency);
  },
  POST: async (_req, ctx) => {
    const currencyId = ctx.params.currencyId;

    const { error } = await api<ICurrency>({
      method: "DELETE",
      path: `/currencies/${currencyId}`,
      auth: ctx.state.auth,
    });

    if (error) return error;

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/currencies",
      },
    });
  },
};

export default function DeleteCurrencyPage({ data: currency, url }: PageProps<ICurrency>) {
  return (
    <Layout
      title="Delete currency"
      titleButtons={[<BackButton href="/currencies" />]}
      url={url}
      segments={["Currencies", currency.name, "Delete"]}
    >
      <div className={tw`mx-auto flex max-w-[400px] flex-col gap-4 rounded-md bg-gray-700 p-3`}>
        <h2>
          Are you sure you want to delete <b className={tw`whitespace-nowrap`}>{currency.name}</b>?
        </h2>

        <form className={tw`flex items-center justify-between gap-4`} method="POST">
          <a className={tw`btn-light-gray`} href="/currencies">
            Cancel
          </a>

          <button type="submit" className={tw`btn-red-border`}>
            Yes, delete
          </button>
        </form>
      </div>
    </Layout>
  );
}