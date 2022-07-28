/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { Input } from "../../components/Input.tsx";
import { Layout } from "../../components/layout.tsx";
import { Game } from "../../types.ts";
import { api } from "../../utils/api.ts";
import { Handlers } from "../../utils/freshTypes.ts";

export const handler: Handlers = {
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const { error, data: createdGame } = await api<Game>({
      method: "POST",
      path: "/games",
      body: JSON.stringify(Object.fromEntries(formData)),
      auth: ctx.state.auth,
    });

    if (error)
      return new Response(
        JSON.stringify({
          error: error?.message,
        }),
        { status: Number(error?.status ?? 500) }
      );

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/games",
      },
    });
  },
};

export default function AddGamePage() {
  return (
    <Layout title="Add a game">
      <div className={tw`flex gap-2 justify-between mb-3`}>
        <h1 className={tw`text-4xl`}>Add a game</h1>

        <a className={tw`px-3 py-2 bg-gray-700 rounded-md`} href="/games">
          Back to games
        </a>
      </div>

      <div className={tw`bg-gray-700 rounded-md mx-auto max-w-[400px] p-3`}>
        <form className={tw`flex flex-col gap-3`} method="POST">
          <Input name="name" label="Name" required />
          <Input name="displayName" label="Display name" required />
          <Input name="path" label="Path" required />
          <Input name="imageUrl" label="Image URL" required />
          <Input name="start" label="Sale starts" type="datetime-local" required />
          <Input name="end" label="Sale ends" type="datetime-local" required />
          <Input name="usdPrice" label="Formatted USD price ($49.99)" required />
          <Input name="priceValue" type="number" label="USD price (49.99)" required />

          <div className={tw`flex gap-2 justify-between`}>
            <a className={tw`px-3 py-2`} href="/games">
              Cancel
            </a>

            <button className={tw`px-3 py-2 bg-gray-800 rounded-md`}>Add game</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
