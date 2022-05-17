import { Title } from "@mantine/core";
import { FC } from "react";
import { cardStyles } from "../Card";
import CountUp from "react-countup";

interface Props {
  description: string;
  amount?: number;
  percentage?: string;
}

export const Stat: FC<Props> = ({ description, amount, percentage }) => {
  const { classes } = cardStyles();

  return (
    <div className={classes.lightCard}>
      <div className={classes.cardContent}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <CountUp end={amount || 0} duration={2} delay={0} preserveValue useEasing>
              {({ countUpRef }) => <h1 ref={countUpRef as any}>{amount || 0}</h1>}
            </CountUp>

            {percentage ? <Title order={3}>({percentage} %)</Title> : <></>}
          </div>

          <Title order={3}>{description}</Title>
        </div>
      </div>
    </div>
  );
};
