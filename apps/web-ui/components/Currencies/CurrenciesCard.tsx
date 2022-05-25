import { createStyles, Skeleton } from "@mantine/core";
import { FC } from "react";
import { ICurrencyWithGuildCount } from "shared";
import { useCurrencies } from "../../hooks/requests";
import { Card } from "../Card";
import { FailedToGet } from "../FailedToGet";
import { FlexDiv } from "../FlexDiv";
import { CardTitle, H3, Text } from "../Text";
import { Tooltip } from "../Tooltip";
import { AddCurrency } from "./AddCurrency";
import { EditCurrency } from "./EditCurrency";

export const CurrenciesCard = () => (
  <Card variant="dark">
    <FlexDiv column fullWidth>
      <CurrenciesTitle />

      <Currencies />
    </FlexDiv>
  </Card>
);

const CurrenciesTitle = () => (
  <FlexDiv justifyBetween alignCenter>
    <CardTitle>Currencies</CardTitle>

    <AddCurrency />
  </FlexDiv>
);

interface Props {
  currency: ICurrencyWithGuildCount;
}
const CurrencyCard: FC<Props> = ({ currency }) => (
  <Card key={currency.code}>
    <FlexDiv column alignCenter>
      <FlexDiv column alignCenter gap05>
        <Text bold>{currency.name}</Text>
        <Text>
          {currency.inFrontOfPrice}59.99{currency.afterPrice}
        </Text>
      </FlexDiv>

      <Tooltip label={`Used by ${currency.guildCount} servers`}>
        <H3>{currency.guildCount} servers</H3>
      </Tooltip>

      <EditCurrency currency={currency} />
    </FlexDiv>
  </Card>
);

export const Currencies = () => {
  const { currencies, error, isLoading } = useCurrencies();

  if (error) return <FailedToGet objName="currencies" />;

  return (
    <div className={styles().classes.currencyGrid}>
      {isLoading
        ? Array(12)
            .fill(1)
            .map((_, i) => <Skeleton key={i} height={175} />)
        : currencies?.map((c) => <CurrencyCard key={c.code} currency={c} />)}
    </div>
  );
};

const styles = createStyles((theme) => ({
  currencyGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",

    [theme.fn.largerThan("sm")]: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
    },

    [theme.fn.largerThan("md")]: {
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
    },
  },
}));
