import { useHasFlags } from "~hooks/useHasFlags";
import { Flags } from "~utils/api/flags";
import { ICurrency } from "~utils/api/types";

import { EditCurrency } from "./EditCurrency";

type Props = {
  currency: ICurrency;
};

export const Currency = ({ currency }: Props) => {
  const canEdit = useHasFlags(Flags.EditCurrencies);

  return (
    <div className="flex flex-col gap-3 rounded-md bg-gray-700 p-3">
      <div className="flex h-full w-full flex-col items-start justify-between gap-2 md:flex-row">
        <h2 className="rounded-md bg-gray-800 py-2 px-3 text-lg md:text-2xl">{currency.name}</h2>

        {canEdit && (
          <div className="flex gap-1 rounded-lg bg-gray-800 p-2">
            <EditCurrency currency={currency} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Spec title="Preview:" value={`${currency.inFrontOfPrice}49.99${currency.afterPrice}`} />
        <Spec title="Code:" value={currency.code} />
        <Spec title="Api value:" value={currency.apiValue} />
      </div>
    </div>
  );
};

const Spec = ({ title, value, wordWrap }: { title: string; value: string; wordWrap?: boolean }) => (
  <p className={`rounded-md bg-gray-800 p-3 ${wordWrap ? "" : "whitespace-nowrap"}`}>
    <b className="text-[17px]">{title}</b> <br /> {value}
  </p>
);
