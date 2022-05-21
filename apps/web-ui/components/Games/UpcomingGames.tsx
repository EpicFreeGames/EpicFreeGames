import { useUpcomingGames } from "../../hooks/requests";
import { FlexDiv } from "../FlexDiv";
import { Text } from "../Text";
import { Games } from "./Games";

export const UpcomingFreeGames = () => {
  const { upcomingGames, error } = useUpcomingGames();

  if (error)
    return (
      <FlexDiv justifyCenter style={{ padding: "1rem" }}>
        <Text>Couldn&lsquo;t get upcoming free games</Text>
      </FlexDiv>
    );

  if (!upcomingGames?.length)
    return (
      <FlexDiv justifyCenter style={{ padding: "1rem" }}>
        <Text>No confirmed upcoming free games</Text>
      </FlexDiv>
    );

  return <Games games={upcomingGames || []} />;
};
