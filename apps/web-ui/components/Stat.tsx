import { Title } from "@mantine/core";
import { FC } from "react";
import { Card } from "./Card";
import CountUp from "react-countup";
import { FlexDiv } from "./FlexDiv";

interface Props {
  description: string;
  amount?: number;
  percentage?: string;
}

export const Stat: FC<Props> = ({ description, amount, percentage }) => {
  return (
    <Card>
      <FlexDiv column justifyBetween alignCenter fullHeight gap05>
        <FlexDiv column gap05>
          <CountUp end={amount || 0} duration={2} delay={0} preserveValue useEasing>
            {({ countUpRef }) => <h1 ref={countUpRef as any}>{amount || 0}</h1>}
          </CountUp>

          {percentage ? <Title order={3}>({percentage} %)</Title> : <></>}
        </FlexDiv>

        <Title order={3}>{description}</Title>
      </FlexDiv>
    </Card>
  );
};
