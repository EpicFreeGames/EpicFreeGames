import { ReactNode } from "react";

import { Flags } from "@efg/types";

import { Layout } from "~components/Layout/Layout";
import { StatusCard } from "~components/StatusCard";
import { useDashboardCounts } from "~utils/api/dashboard/counts";
import { Page } from "~utils/types";

export const IndexPage: Page = () => (
  <Layout title="Dash">
    <Counts />
  </Layout>
);

const Counts = () => {
  const { data: counts, error, isLoading } = useDashboardCounts();

  if (isLoading) return <StatusCard>Loading...</StatusCard>;
  if (error) return <StatusCard error>Error loading dashboard</StatusCard>;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 rounded-md bg-gray-700 p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-md bg-gray-800 py-2 px-3">
            <Heading>Total servers in db:</Heading>

            <div className="flex items-center gap-2">
              <p className="text-lg">{counts?.total}</p>
              {counts?.totalToday && (
                <p className="text-sm text-green-500">(+{counts?.totalToday} today)</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-md bg-gray-800 py-2 px-3">
            <Heading>Sendable:</Heading>

            <p className="text-lg">{counts?.sendable}</p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-md bg-gray-800 py-2 px-3">
            <Heading>Total commands:</Heading>

            <p className="text-lg">{counts?.totalCommands}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-md bg-gray-700 p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col items-center gap-2 rounded-md bg-gray-800 py-2 px-3">
            <Heading>Has webhook:</Heading>

            <p className="text-lg">{counts?.hasWebhook}</p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-md bg-gray-800 py-2 px-3">
            <Heading>Has channel only:</Heading>

            <p className="text-lg">{counts?.hasOnlyChannel}</p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-md bg-gray-800 py-2 px-3">
            <Heading>Has set a role:</Heading>

            <p className="text-lg">{counts?.hasRole}</p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-md bg-gray-800 py-2 px-3">
            <Heading>Has set a thread:</Heading>

            <p className="text-lg">{counts?.hasThread}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-md bg-gray-700 p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-2 rounded-md bg-gray-800 py-2 px-3">
            <Heading>Has changed the language:</Heading>

            <p className="text-lg">{counts?.hasChangedLanguage}</p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-md bg-gray-800 py-2 px-3">
            <Heading>Has changed the currency:</Heading>

            <p className="text-lg">{counts?.hasChangedCurrency}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-md bg-gray-700 p-3">
        <div className="flex flex-col items-center gap-2 rounded-md bg-gray-800 py-2 px-3">
          <Heading>Webhook adoption:</Heading>

          <p className="text-lg">{counts?.webhookAdoption}</p>
        </div>
      </div>
    </div>
  );
};

const Heading = ({ children }: { children: ReactNode }) => (
  <h2 className="text-md font-medium sm:text-lg">{children}</h2>
);

IndexPage.requireAuth = true;
IndexPage.requiredFlags = [Flags.GetDashboard];

export default IndexPage;
