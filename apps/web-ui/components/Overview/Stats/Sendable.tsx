import { Skeleton } from "@mantine/core";
import { useGuildStats } from "../../../hooks/requests";
import { cardStyles } from "../../Card";
import { Stat } from "../../Stat";

export const Sendable = () => {
  const { guildStats } = useGuildStats();
  const { classes } = cardStyles();

  if (!guildStats) return <Skeleton className={classes.lightCardSkele} />;

  return (
    <Stat amount={guildStats?.hasOnlyChannel + guildStats?.hasWebhook} description="Sendable" />
  );
};
