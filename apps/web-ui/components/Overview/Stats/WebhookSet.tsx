import { useGuildStats } from "../../../hooks/requests";
import { Stat } from "./Stat";

export const WebhookSet = () => {
  const { guildStats, isLoading } = useGuildStats();

  const percentage = guildStats
    ? (guildStats.hasWebhook / (guildStats.dbGuildCount + guildStats.hasOnlyChannel)) * 100
    : 0;

  return (
    <Stat
      isLoading={isLoading}
      amount={guildStats?.hasWebhook}
      description="Webhook set"
      percentage={percentage}
    />
  );
};
