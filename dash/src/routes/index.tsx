/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";
import { Layout } from "../components/Layout.tsx";
import { ICounts } from "../types.ts";
import { api } from "../utils/api.ts";
import { Handlers } from "../utils/freshTypes.ts";

export const handler: Handlers<ICounts> = {
  GET: async (_req, ctx) => {
    const { error, data: counts } = await api<ICounts>({
      method: "GET",
      path: "/dashboard/counts",
      auth: ctx.state.auth,
    });

    if (error) return error;

    return ctx.render(counts);
  },
};

export default function DashIndex({ data: counts }: PageProps<ICounts>) {
  return (
    <Layout title="Dashboard">
      <div className={tw`flex flex-col gap-2`}>
        <div className={tw`grid gap-2 grid-cols-1 halfMax:grid-cols-2`}>
          <div className={tw`p-3 bg-gray-600 rounded-md flex flex-col items-center gap-2`}>
            <h2 className={tw`text-2xl font-bold`}>Total servers in db</h2>
            <p className={tw`text-lg `}>{counts.total}</p>
          </div>

          <div className={tw`p-3 bg-gray-600 rounded-md flex flex-col items-center gap-2`}>
            <h2 className={tw`text-2xl font-bold`}>Total commands</h2>
            <p className={tw`text-lg `}>{counts.sendable}</p>
          </div>
        </div>

        <div className={tw`grid gap-2 grid-cols-1 halfMax:grid-cols-2 max:grid-cols-4`}>
          <div className={tw`p-3 bg-gray-600 rounded-md flex flex-col items-center gap-2`}>
            <h2 className={tw`text-2xl font-bold`}>Sendable</h2>
            <p className={tw`text-lg `}>{counts.sendable}</p>
          </div>

          <div className={tw`p-3 bg-gray-600 rounded-md flex flex-col items-center gap-2`}>
            <h2 className={tw`text-2xl font-bold`}>Only a channel</h2>
            <p className={tw`text-lg `}>{counts.hasOnlyChannel}</p>
          </div>

          <div className={tw`p-3 bg-gray-600 rounded-md flex flex-col items-center gap-2`}>
            <h2 className={tw`text-2xl font-bold`}>Webhook</h2>
            <p className={tw`text-lg `}>{counts.hasWebhook}</p>
          </div>

          <div className={tw`p-3 bg-gray-600 rounded-md flex flex-col items-center gap-2`}>
            <h2 className={tw`text-2xl font-bold`}>Webhook adoption</h2>
            <p className={tw`text-lg `}>{counts.webhookAdoption}</p>
          </div>
        </div>

        <div className={tw`grid gap-2 grid-cols-1 halfMax:grid-cols-2 max:grid-cols-4`}>
          <div className={tw`p-3 bg-gray-600 rounded-md flex flex-col items-center gap-2`}>
            <h2 className={tw`text-lg font-bold`}>Has set a role</h2>
            <p className={tw`text-lg `}>{counts.hasRole}</p>
          </div>

          <div className={tw`p-3 bg-gray-600 rounded-md flex flex-col items-center gap-2`}>
            <h2 className={tw`text-lg font-bold`}>Has changed language</h2>
            <p className={tw`text-lg `}>{counts.hasChangedLanguage}</p>
          </div>

          <div className={tw`p-3 bg-gray-600 rounded-md flex flex-col items-center gap-2`}>
            <h2 className={tw`text-lg font-bold`}>Has changed currency</h2>
            <p className={tw`text-lg `}>{counts.hasChangedCurrency}</p>
          </div>

          <div className={tw`p-3 bg-gray-600 rounded-md flex flex-col items-center gap-2`}>
            <h2 className={tw`text-lg font-bold`}>Has set a thread</h2>
            <p className={tw`text-lg `}>{counts.hasThread}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
