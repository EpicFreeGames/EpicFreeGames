/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";
import { BackButton } from "../../../components/BackButton.tsx";
import { Layout } from "../../../components/Layout.tsx";
import { ICurrency } from "../../../types.ts";
import { api } from "../../../utils/api.ts";
import { Handlers } from "../../../utils/freshTypes.ts";

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
      titleButton={<BackButton href="/currencies" />}
      url={url}
      segments={["Currencies", currency.name, "Delete"]}
    >
      <div className={tw`bg-gray-700 rounded-md mx-auto max-w-[400px] p-3`}>
        <h2>
          Are you sure you want to delete <b>{currency.name}</b>?
        </h2>

        <form className={tw`flex flex-col gap-3`} method="POST">
          <div className={tw`flex gap-2 justify-between  items-center`}>
            <a className={tw`btn bg-gray-600`} href="/currencies">
              Cancel
            </a>

            <button type="submit" className={tw`btn bg-red-700`}>
              Yes, delete
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}