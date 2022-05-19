import { FC } from "react";
import { Card } from "../../Card";
import CountUp from "react-countup";
import { FlexDiv } from "../../FlexDiv";
import { H3, textStyles } from "../../Text";
import { Skeleton } from "@mantine/core";
import { Tooltip } from "../../Tooltip";

type Props = {
  description: string;
  amount?: number;
  percentage?: number;
  isLoading: boolean;
};

export const Stat: FC<Props> = ({ description, amount, percentage, isLoading }) => {
  const { classes } = textStyles();

  return (
    <Card>
      <FlexDiv column justifyBetween alignCenter fullHeight gap05>
        <FlexDiv column gap05 alignCenter fullWidth>
          {isLoading ? (
            <Skeleton height="2rem" />
          ) : (
            <CountUp
              end={amount || 0}
              duration={2}
              delay={0}
              preserveValue
              useEasing
              className={classes.h1}
            />
          )}

          {isLoading ? (
            <Skeleton height="1rem" />
          ) : percentage ? (
            <Tooltip
              label={`${percentage.toFixed(0)} % of servers have set a webhook`}
              style={{ paddingTop: "0.4rem" }}
            >
              <CountUp
                end={percentage || 0}
                duration={2}
                delay={0}
                preserveValue
                useEasing
                className={classes.h3}
                suffix=" %"
              />
            </Tooltip>
          ) : (
            <></>
          )}
        </FlexDiv>

        <H3>{description}</H3>
      </FlexDiv>
    </Card>
  );
};
