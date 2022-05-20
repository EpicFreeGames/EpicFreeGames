import { IGame } from "shared";
import { Card } from "../Card";
import { FlexDiv } from "../FlexDiv";
import { H3, Text } from "../Text";
import { ConfirmGame } from "./ConfirmGame";
import { EditGame } from "./EditGame";
import { RemoveGame } from "./RemoveGame";

export const Game = ({ game }: { game: IGame }) => {
  return (
    <Card>
      <FlexDiv column justifyBetween fullHeight>
        <FlexDiv column>
          <FlexDiv justifyBetween>
            <H3>{game.name}</H3>

            <EditGame game={game} />
          </FlexDiv>

          <Text>
            <b>Slug:</b> {game.slug}
          </Text>

          <FlexDiv column gap05>
            <Text>Prices:</Text>

            {Object.entries(game.price).map(([currency, index]) => (
              <Text key={index}>
                <b>{currency}:</b> {game.price[currency]}
              </Text>
            ))}
          </FlexDiv>

          <img src={game.imageUrl} style={{ objectFit: "contain", width: "100%" }}></img>
        </FlexDiv>

        <FlexDiv gap05>
          <ConfirmGame game={game} />
          <RemoveGame game={game} />
        </FlexDiv>
      </FlexDiv>
    </Card>
  );
};
