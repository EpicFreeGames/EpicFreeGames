/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { Edit, Trash } from "icons";
import { h } from "preact";
import { tw } from "twind";
import { Layout } from "../../components/layout.tsx";
import { ICurrency } from "../../types.ts";
import { api } from "../../utils/api.ts";
import { Handlers } from "../../utils/freshTypes.ts";

export const handler: Handlers<ICurrency[]> = {
  GET: async (_req, ctx) => {
    const { error, data: currencies } = await api<ICurrency[]>({
      method: "GET",
      path: "/currencies",
      auth: ctx.state.auth,
    });

    if (error)
      return new Response(
        JSON.stringify({
          error: error?.message,
        }),
        { status: Number(error?.status ?? 500) }
      );

    return ctx.render(currencies);
  },
};

export default function I18nPage({ data }: PageProps<ICurrency[]>) {
  return (
    <Layout title="I18n">
      <div className={tw`flex gap-2 justify-between mb-4`}>
        <h1 className={tw`flex justify-center items-center text-3xl halfMax:text-4xl`}>
          Currencies
        </h1>

        <a className={tw`btn bg-gray-700`} href="/currencies/add">
          Add a currency
        </a>
      </div>

      <div className={tw`grid grid-cols-1 gap-3 max:grid-cols-2`}>
        {data.map((currency) => (
          <Currnecy key={currency.name} currency={currency} />
        ))}
      </div>
    </Layout>
  );
}

const Currnecy = ({ currency }: { currency: ICurrency }) => (
  <div className={tw`bg-gray-700 p-3 rounded-md flex flex-col gap-3`}>
    <div className={tw`flex gap-2 justify-between w-full flex-col halfMax:flex-row`}>
      <h2 className={tw`bg-gray-800 py-2 px-3 rounded-md text-lg halfMax:text-2xl`}>
        {currency.name}
      </h2>

      <div className={tw`flex gap-2`}>
        <a className={tw`btn bg-gray-800`} href={`/currencies/${currency.id}/edit`}>
          <Edit size={25} />
        </a>
        <a className={tw`btn bg-gray-800`} href={`/currencies/${currency.id}/delete`}>
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
  <p className={tw`bg-gray-800 p-3 rounded-md whitespace-nowrap`}>
    <b className={tw`text-[17px]`}>{title}</b> {value}
  </p>
);
