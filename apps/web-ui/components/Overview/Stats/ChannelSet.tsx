import { Skeleton } from "@mantine/core";
import { useGuildStats } from "../../../utils/swr";
import { cardStyles } from "../../Card";
import { Stat } from "../../Stat";

export const ChannelSet = () => {
  const { guildStats } = useGuildStats();
  const { classes } = cardStyles();

  if (!guildStats) return <Skeleton className={classes.lightCardSkele} />;

  return <Stat amount={guildStats.hasOnlyChannel} description="Channel set" />;
};
