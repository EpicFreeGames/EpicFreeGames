import { Text, Title } from "@mantine/core";
import { FC } from "react";
import { ICurrencyWithGuildCount } from "shared";
import { useCurrencies } from "../../hooks/requests";
import { Card } from "../Card";
import { FlexDiv } from "../FlexDiv";
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
  <FlexDiv justifyBetween>
    <Title order={2}>Currencies</Title>

    <AddCurrency />
  </FlexDiv>
);

export const Currencies = () => {
  const { currencies } = useCurrencies();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
      {currencies?.map((c) => (
        <CurrencyCard key={c.code} currency={c} />
      ))}
    </div>
  );
};

interface Props {
  currency: ICurrencyWithGuildCount;
}
const CurrencyCard: FC<Props> = ({ currency }) => (
  <Card key={currency.code}>
    <FlexDiv column alignCenter>
      <FlexDiv column alignCenter gap05>
        <Title order={3}>{currency.name}</Title>
        <Text>
          {currency.inFrontOfPrice}59.99{currency.afterPrice}
        </Text>
      </FlexDiv>

      <Tooltip label={`Used by ${currency.guildCount} servers`}>
        <Title order={3}>{currency.guildCount} servers</Title>
      </Tooltip>

      <EditCurrency currency={currency} />
    </FlexDiv>
  </Card>
);
