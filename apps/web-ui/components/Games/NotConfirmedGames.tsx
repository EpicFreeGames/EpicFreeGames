import { useNotConfirmedGames } from "../../hooks/requests";
import { FlexDiv } from "../FlexDiv";
import { Text } from "../Text";
import { Games } from "./Games";

export const NotConfirmedFreeGames = () => {
  const { notConfirmedGames, error } = useNotConfirmedGames();

  if (error)
    return (
      <FlexDiv justifyCenter style={{ padding: "1rem" }}>
        <Text>Couldn&lsquo;t get not confirmed free games</Text>
      </FlexDiv>
    );

  if (!notConfirmedGames?.length)
    return (
      <FlexDiv justifyCenter style={{ padding: "1rem" }}>
        <Text>No not confirmed free games</Text>
      </FlexDiv>
    );

  return <Games games={notConfirmedGames || []} />;
};
