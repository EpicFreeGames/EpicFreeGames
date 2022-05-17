import { Skeleton } from "@mantine/core";
import { useCommandStats } from "../../../utils/swr";
import { cardStyles } from "../../Card";
import { Stat } from "../../Stats/Stat";

export const CommandsRan = () => {
  const { commandStats } = useCommandStats();
  const { classes } = cardStyles();

  if (!commandStats) return <Skeleton className={classes.lightCardSkele} />;

  return <Stat amount={commandStats.allTime} description="Commands ran" />;
};
