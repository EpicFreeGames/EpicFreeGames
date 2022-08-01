/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";
import { BackButton } from "../../../components/BackButton.tsx";
import { Input } from "../../../components/Input.tsx";
import { Layout } from "../../../components/Layout.tsx";
import { ICurrency } from "../../../types.ts";
import { api } from "../../../utils/api.ts";
import { Handlers } from "../../../utils/freshTypes.ts";

export const handler: Handlers<ICurrency> = {
  POST: async (req, ctx) => {
    const currencyId = ctx.params.currencyId;
    const formData = await req.formData();

    const { error } = await api<ICurrency>({
      method: "PATCH",
      path: `/currencies/${currencyId}`,
      body: JSON.stringify(Object.fromEntries(formData)),
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
};

export default function EditCurrencyPage({ data: currency, url }: PageProps<ICurrency>) {
  return (
    <Layout
      title="Edit currency"
      titleButton={<BackButton href="/currencies" />}
      url={url}
      segments={["Currencies", currency.name, "Edit"]}
    >
      <div className={tw`bg-gray-700 rounded-md mx-auto max-w-[400px] p-3`}>
        <h2 className={tw`text-2xl mb-2`}>
          Edit <b>{currency.name}</b>
        </h2>

        <form className={tw`flex flex-col gap-3`} method="POST">
          <Input name="code" label="Code" defaultValue={currency.code} required />
          <Input name="name" label="Name" defaultValue={currency.name} required />
          <Input name="apiValue" label="Api value" defaultValue={currency.apiValue} required />
          <Input
            name="inFrontOfPrice"
            label="In front of price"
            defaultValue={currency.inFrontOfPrice}
            required
          />
          <Input
            name="afterPrice"
            label="After price"
            defaultValue={currency.afterPrice}
            required
          />

          <div className={tw`flex gap-2 justify-between items-center`}>
            <a className={tw`btn bg-gray-600`} href="/currencies">
              Cancel
            </a>

            <button type="submit" className={tw`btn bg-gray-800`}>
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
