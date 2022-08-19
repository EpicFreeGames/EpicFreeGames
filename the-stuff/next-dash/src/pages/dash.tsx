import { Layout } from "~components/Layout/Layout";
import { StatusCard } from "~components/StatusCard";
import { useDashboardCounts } from "~utils/api/dashboard/counts";
import { Flags } from "~utils/api/flags";
import { Page } from "~utils/types";

export const DashPage: Page = () => (
  <Layout title="Dash">
    <Counts />
  </Layout>
);

const Counts = () => {
  const { data: counts, error, isLoading } = useDashboardCounts();

  if (isLoading) return <StatusCard>Loading...</StatusCard>;
  if (error) return <StatusCard error>Error loading counts</StatusCard>;

  return <div>{counts?.total}</div>;
};

DashPage.requireAuth = true;
DashPage.requiredFlags = [Flags.GetDashboard];

export default DashPage;
