import { FC } from "react";
import { Card } from "./Card";
import CountUp from "react-countup";
import { FlexDiv } from "./FlexDiv";
import { H3, textStyles } from "./Text";

interface Props {
  description: string;
  amount?: number;
  percentage?: string;
}

export const Stat: FC<Props> = ({ description, amount, percentage }) => {
  const { classes } = textStyles();

  return (
    <Card>
      <FlexDiv column justifyBetween alignCenter fullHeight gap05>
        <FlexDiv column gap05 alignCenter fullWidth>
          <CountUp
            end={amount || 0}
            duration={2}
            delay={0}
            preserveValue
            useEasing
            className={classes.h1}
          />

          {percentage ? <H3>({percentage} %)</H3> : <></>}
        </FlexDiv>

        <H3>{description}</H3>
      </FlexDiv>
    </Card>
  );
};
