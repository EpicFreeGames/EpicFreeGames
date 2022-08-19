import { AddCurrency } from "~components/Currency/AddCurrency";
import { Currency } from "~components/Currency/Currency";
import { Layout } from "~components/Layout/Layout";
import { StatusCard } from "~components/StatusCard";
import { useCurrencies } from "~utils/api/currencies/getCurrencies";

export default function CurrenciesPage() {
  return (
    <Layout title="Currencies" titleButtons={[AddCurrency]}>
      <Currencies />
    </Layout>
  );
}

const Currencies = () => {
  const { data: currencies, isLoading, error } = useCurrencies();

  if (isLoading) return <StatusCard>Loading...</StatusCard>;
  if (error) return <StatusCard error>Error loading games</StatusCard>;

  return (
    <div className="max:grid-cols-2 grid grid-cols-1 gap-3">
      {currencies && currencies?.length ? (
        currencies?.map((currency) => <Currency currency={currency} key={currency.id} />)
      ) : (
        <StatusCard>No currencies</StatusCard>
      )}
    </div>
  );
};
