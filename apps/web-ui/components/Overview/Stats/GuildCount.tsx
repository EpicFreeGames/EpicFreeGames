import { useGuildStats } from "../../../hooks/requests";
import { Stat } from "./Stat";

export const GuildCount = () => {
  const { guildStats, isLoading } = useGuildStats();

  return (
    <Stat isLoading={isLoading} description="Servers in db" amount={guildStats?.dbGuildCount} />
  );
};
