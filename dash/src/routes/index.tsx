/** @jsx h */
import { PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "twind";
import { Layout } from "~components/Layout/Layout.tsx";
import { api } from "~utils/api.ts";
import { Handlers } from "~utils/freshTypes.ts";
import { ICounts } from "../types.ts";

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
          <DashItem title="Total servers in db" value={counts.total} />
          <DashItem title="Total commands" value={counts.totalCommands} />
        </div>

        <div className={tw`grid gap-2 grid-cols-1 halfMax:grid-cols-2 max:grid-cols-4`}>
          <DashItem title="Sendable" value={counts.sendable} />
          <DashItem title="Only a channel" value={counts.hasOnlyChannel} />
          <DashItem title="Webhook" value={counts.hasWebhook} />
          <DashItem title="Webhook adoption" value={counts.webhookAdoption} />
        </div>

        <div className={tw`grid gap-2 grid-cols-1 halfMax:grid-cols-2 max:grid-cols-4`}>
          <DashItem title="Has set a thread" value={counts.hasThread} small />
          <DashItem title="Has set a role" value={counts.hasRole} small />
          <DashItem title="Has changed currency" value={counts.hasChangedCurrency} small />
          <DashItem title="Has changed language" value={counts.hasChangedLanguage} small />
        </div>
      </div>
    </Layout>
  );
}

const DashItem = ({
  title,
  value,
  small,
}: {
  title: string;
  value: number | string;
  small?: boolean;
}) => (
  <div className={tw`p-3 bg-gray-600 rounded-md flex flex-col gap-2 halfMax:items-center`}>
    <h2 className={tw`${small ? "text-lg" : "text-2xl"} font-bold `}>{title}</h2>
    <p className={tw`text-lg `}>{value}</p>
  </div>
);
