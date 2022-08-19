/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";

import { Input } from "~components/Input.tsx";
import { BackButton } from "~components/Layout/BackButton.tsx";
import { Layout } from "~components/Layout/Layout.tsx";
import { api } from "~utils/api.ts";
import { stringifyFormData } from "~utils/formData.ts";
import { Handlers } from "~utils/freshTypes.ts";

import { ICurrency } from "../../../types.ts";

export const handler: Handlers<ICurrency> = {
  POST: async (req, ctx) => {
    const currencyId = ctx.params.currencyId;
    const formData = await req.formData();

    const { error } = await api<ICurrency>({
      method: "PATCH",
      path: `/currencies/${currencyId}`,
      body: stringifyFormData(formData),
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
      titleButtons={[<BackButton href="/currencies" />]}
      url={url}
      segments={["Currencies", currency.name, "Edit"]}
    >
      <div className={tw`mx-auto max-w-[400px] rounded-md bg-gray-700 p-3`}>
        <h2 className={tw`mb-2 text-2xl`}>
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

          <div className={tw`flex items-center justify-between gap-2`}>
            <a className={tw`btn-light-gray`} href="/currencies">
              Cancel
            </a>

            <button type="submit" className={tw`btn-blue-border`}>
              Save
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}