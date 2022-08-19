/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { Edit, Trash } from "icons";
import { h } from "preact";
import { tw } from "twind";

import { Layout } from "~components/Layout/Layout.tsx";
import { api } from "~utils/api.ts";
import { Handlers } from "~utils/freshTypes.ts";

import { ICurrency } from "../../types.ts";

export const handler: Handlers<ICurrency[]> = {
  GET: async (_req, ctx) => {
    const { error, data: currencies } = await api<ICurrency[]>({
      method: "GET",
      path: "/currencies",
      auth: ctx.state.auth,
    });

    if (error) return error;

    return ctx.render(currencies);
  },
};

export default function I18nPage({ data, url }: PageProps<ICurrency[]>) {
  return (
    <Layout
      title="Currencies"
      titleButtons={[
        <a className={tw`btn-gray`} href="/currencies/add">
          Add a currency
        </a>,
      ]}
      url={url}
      segments={["Currencies"]}
    >
      <div className={tw`max:grid-cols-2 grid grid-cols-1 gap-3`}>
        {data.map((currency) => (
          <Currnecy key={currency.name} currency={currency} />
        ))}
      </div>
    </Layout>
  );
}

const Currnecy = ({ currency }: { currency: ICurrency }) => (
  <div className={tw`flex flex-col gap-3 rounded-md bg-gray-700 p-3`}>
    <div className={tw`flex w-full flex-col justify-between gap-2 md:flex-row`}>
      <h2 className={tw`rounded-md bg-gray-800 py-2 px-3 text-lg md:text-2xl`}>{currency.name}</h2>

      <div className={tw`flex gap-2`}>
        <a className={tw`btn-dark-gray`} href={`/currencies/${currency.id}/edit`}>
          <Edit size={25} />
        </a>
        <a className={tw`btn-dark-gray`} href={`/currencies/${currency.id}/delete`}>
          <Trash size={25} className={tw`text-red-500`} />
        </a>
      </div>
    </div>

    <div className={tw`flex flex-col gap-2`}>
      <Spec title="Preview:" value={`${currency.inFrontOfPrice}49.99${currency.afterPrice}`} />
      <Spec title="Code:" value={currency.code} />
      <Spec title="Api value:" value={currency.apiValue} />
    </div>
  </div>
);

const Spec = ({ title, value }: { title?: string; value: string }) => (
  <p className={tw`whitespace-nowrap rounded-md bg-gray-800 p-3`}>
    <b className={tw`text-[17px]`}>{title}</b> {value}
  </p>
);