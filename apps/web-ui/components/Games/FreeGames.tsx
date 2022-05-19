import { useFreeGames } from "../../hooks/requests";
import { FlexDiv } from "../FlexDiv";
import { Text } from "../Text";
import { Games } from "./Games";

export const FreeGames = () => {
  const { freeGames, error } = useFreeGames();

  if (error)
    return (
      <FlexDiv justifyCenter style={{ padding: "1rem" }}>
        <Text>Couldn't get free games</Text>
      </FlexDiv>
    );

  if (!freeGames?.length)
    return (
      <FlexDiv justifyCenter style={{ padding: "1rem" }}>
        <Text>No confirmed free games</Text>
      </FlexDiv>
    );

  return <Games games={freeGames || []} />;
};
