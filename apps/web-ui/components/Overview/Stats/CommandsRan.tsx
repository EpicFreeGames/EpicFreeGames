import { Skeleton } from "@mantine/core";
import { useCommandStats } from "../../../hooks/requests";
import { cardStyles } from "../../Card";
import { Stat } from "../../Stat";

export const CommandsRan = () => {
  const { commandStats } = useCommandStats();
  const { classes } = cardStyles();

  if (!commandStats) return <Skeleton className={classes.lightCardSkele} />;

  return <Stat amount={commandStats.allTime} description="Commands ran" />;
};
