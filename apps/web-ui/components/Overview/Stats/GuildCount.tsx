import { Skeleton } from "@mantine/core";
import { useGuildStats } from "../../../utils/swr";
import { cardStyles } from "../../Card";
import { Stat } from "../../Stat";

export const GuildCount = () => {
  const { guildStats } = useGuildStats();
  const { classes } = cardStyles();

  if (!guildStats) return <Skeleton className={classes.lightCardSkele} />;

  return <Stat description="Servers in db" amount={guildStats?.dbGuildCount} />;
};
