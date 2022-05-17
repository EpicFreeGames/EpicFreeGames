import { Skeleton } from "@mantine/core";
import { useGuildStats } from "../../../utils/swr";
import { cardStyles } from "../../Card";
import { Stat } from "../../Stats/Stat";

export const Sendable = () => {
  const { guildStats } = useGuildStats();
  const { classes } = cardStyles();

  if (!guildStats) return <Skeleton className={classes.lightCardSkele} />;

  return (
    <Stat amount={guildStats?.hasOnlyChannel + guildStats?.hasWebhook} description="Sendable" />
  );
};
