import { IGame } from "shared";
import { Card } from "../Card";
import { FlexDiv } from "../FlexDiv";
import { H3, Text } from "../Text";
import { ConfirmGame } from "./ConfirmGame";
import { UnconfirmGame } from "./UnconfirmGame";

export const Game = ({ game }: { game: IGame }) => {
  return (
    <Card>
      <FlexDiv column justifyBetween fullHeight>
        <FlexDiv column>
          <H3>{game.name}</H3>

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

        <FlexDiv>
          <ConfirmGame game={game} />
          <UnconfirmGame game={game} />
        </FlexDiv>
      </FlexDiv>
    </Card>
  );
};
