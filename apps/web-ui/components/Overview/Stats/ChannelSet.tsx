import { useGuildStats } from "../../../hooks/requests";
import { Stat } from "./Stat";

export const ChannelSet = () => {
  const { guildStats, isLoading } = useGuildStats();

  return (
    <Stat isLoading={isLoading} amount={guildStats?.hasOnlyChannel} description="Channel set" />
  );
};
