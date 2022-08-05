/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";
import { Input } from "~components/Input.tsx";
import { BackButton } from "~components/Layout/BackButton.tsx";
import { Layout } from "~components/Layout/Layout.tsx";
import { api } from "~utils/api.ts";
import { Handlers } from "~utils/freshTypes.ts";
import { IGame } from "../../types.ts";

export const handler: Handlers = {
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const { error } = await api<IGame>({
      method: "POST",
      path: "/games",
      body: JSON.stringify(Object.fromEntries(formData)),
      auth: ctx.state.auth,
    });

    if (error) return error;

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/games",
      },
    });
  },
};

export default function AddGamePage({ url }: PageProps) {
  return (
    <Layout
      title="Add a game"
      titleButtons={[<BackButton href="/games" />]}
      url={url}
      segments={["Games", "Add a game"]}
    >
      <div className={tw`bg-gray-700 rounded-md mx-auto max-w-[400px] p-3`}>
        <form className={tw`flex flex-col gap-3`} method="POST">
          <Input name="name" label="Name" required />
          <Input name="displayName" label="Display name" required />
          <Input name="path" label="Path" required />
          <Input name="imageUrl" label="Image URL" required />
          <Input name="start" label="Sale starts" type="datetime-local" required />
          <Input name="end" label="Sale ends" type="datetime-local" required />
          <Input name="usdPrice" label="Formatted USD price ($49.99)" required />
          <Input name="priceValue" type="number" label="USD price (49.99)" step={0.01} required />

          <div className={tw`flex gap-2 justify-between items-center`}>
            <a className={tw`btn bg-gray-600`} href="/games">
              Cancel
            </a>

            <button className={tw`btn bg-gray-800`}>Add</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}