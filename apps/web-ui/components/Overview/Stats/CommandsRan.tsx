import { useCommandStats } from "../../../hooks/requests";
import { Stat } from "./Stat";

export const CommandsRan = () => {
  const { commandStats, isLoading } = useCommandStats();

  return <Stat isLoading={isLoading} amount={commandStats?.allTime} description="Commands ran" />;
};
