import { Layout } from "~components/Layout/Layout";
import { AddSending } from "~components/Sends/AddSending";
import { Sending } from "~components/Sends/Sending";
import { StatusCard } from "~components/StatusCard";
import { Flags } from "~utils/api/flags";
import { useSends } from "~utils/api/sends/getSends";
import { Page } from "~utils/types";

const SendsPage: Page = () => {
  return (
    <Layout title="Sends" titleButtons={[AddSending]}>
      <Sends />
    </Layout>
  );
};

const Sends = () => {
  const { data: sends, error, isLoading } = useSends();

  if (isLoading) return <StatusCard>Loading...</StatusCard>;
  if (error) return <StatusCard error>Error loading sends</StatusCard>;

  return (
    <div className="flex flex-col gap-3">
      {sends && sends?.length ? (
        sends?.map((sending) => <Sending sending={sending} key={sending.id} />)
      ) : (
        <StatusCard>No sends</StatusCard>
      )}
    </div>
  );
};

SendsPage.requiredFlags = [Flags.GetSendings];
SendsPage.requireAuth = false;

export default SendsPage;
