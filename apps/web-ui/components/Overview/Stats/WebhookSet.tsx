import { Skeleton } from "@mantine/core";
import { useGuildStats } from "../../../utils/swr";
import { cardStyles } from "../../Card";
import { Stat } from "../Stat";

export const WebhookSet = () => {
  const { guildStats } = useGuildStats();
  const { classes } = cardStyles();

  if (!guildStats) return <Skeleton className={classes.lightCardSkele} />;

  return (
    <Stat
      amount={guildStats.hasWebhook}
      description="Webhook set"
      percentage={(
        (guildStats.hasWebhook / (guildStats.dbGuildCount + guildStats.hasOnlyChannel)) *
        100
      ).toFixed(2)}
    />
  );
};
