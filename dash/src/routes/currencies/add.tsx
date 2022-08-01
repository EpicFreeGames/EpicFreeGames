/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";
import { BackButton } from "../../components/BackButton.tsx";
import { Input } from "../../components/Input.tsx";
import { Layout } from "../../components/Layout.tsx";
import { ICurrency } from "../../types.ts";
import { api } from "../../utils/api.ts";
import { Handlers } from "../../utils/freshTypes.ts";

export const handler: Handlers = {
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const { error } = await api<ICurrency>({
      method: "POST",
      path: "/currencies",
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
};

export default function AddCurrencyPage({ url }: PageProps) {
  return (
    <Layout
      title="Add a currency"
      titleButton={<BackButton href="/currencies" />}
      url={url}
      segments={["Currencies", "Add a currency"]}
    >
      <div className={tw`bg-gray-700 rounded-md mx-auto max-w-[400px] p-3`}>
        <form className={tw`flex flex-col gap-3`} method="POST">
          <Input name="code" label="Code" required />
          <Input name="name" label="Name" required />
          <Input name="apiValue" label="Api value" required />
          <Input name="inFrontOfPrice" label="In front of price" />
          <Input name="afterPrice" label="After price" />

          <div className={tw`flex gap-2 justify-between items-center`}>
            <a className={tw`btn bg-gray-600`} href="/currencies">
              Cancel
            </a>

            <button type="submit" className={tw`btn bg-gray-800`}>
              Add
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
