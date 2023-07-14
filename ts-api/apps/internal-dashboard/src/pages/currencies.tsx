import { Flags } from "@efg/types";

import { Currency } from "~components/Currency/Currency";
import { Layout } from "~components/Layout/Layout";
import { StatusCard } from "~components/StatusCard";
import { useCurrencies } from "~utils/api/currencies/getCurrencies";

const CurrenciesPage = () => (
  <Layout title="Currencies">
    <Currencies />
  </Layout>
);

const Currencies = () => {
  const { data: currencies, isLoading, error } = useCurrencies();

  if (isLoading) return <StatusCard>Loading...</StatusCard>;
  if (error) return <StatusCard error>Error loading games</StatusCard>;

  return (
    <div className="max:grid-cols-2 grid grid-cols-1 gap-3">
      {currencies && currencies?.length ? (
        currencies?.map((currency) => <Currency currency={currency} key={currency.code} />)
      ) : (
        <StatusCard>No currencies</StatusCard>
      )}
    </div>
  );
};

CurrenciesPage.requireAuth = true;
CurrenciesPage.requiredFlags = [Flags.GetCurrencies];

export default CurrenciesPage;
