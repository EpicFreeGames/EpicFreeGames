import { useGuildStats } from "../../../hooks/requests";
import { Stat } from "./Stat";

export const Sendable = () => {
  const { guildStats, isLoading } = useGuildStats();

  const amount = guildStats ? guildStats?.hasOnlyChannel + guildStats?.hasWebhook : 0;

  return <Stat isLoading={isLoading} amount={amount} description="Sendable" />;
};
