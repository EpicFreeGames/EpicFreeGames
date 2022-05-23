import { IGame } from "shared";
import { FlexDiv } from "../FlexDiv";
import { Game } from "../Game";

export const Games = ({ games }: { games: IGame[] }) => (
  <FlexDiv gap05>
    {games.map((game) => (
      <Game key={game._id} game={game} />
    ))}
  </FlexDiv>
);
