import { useHasPerms } from "~hooks/useHasPerms";
import { Flags } from "~utils/api/flags";
import { ICurrency } from "~utils/api/types";
import { EditCurrency } from "./EditCurrency";

type Props = {
  currency: ICurrency;
};

export const Currency = ({ currency }: Props) => {
  const canEdit = useHasPerms(Flags.EditCurrencies);

  return (
    <div className="bg-gray-700 p-3 rounded-md flex flex-col gap-3">
      <div className="flex gap-2 justify-between w-full h-full flex-col halfMax:flex-row items-start">
        <h2 className="bg-gray-800 py-2 px-3 rounded-md text-lg halfMax:text-2xl">
          {currency.name}
        </h2>

        {canEdit && (
          <div className="flex gap-1 p-2 bg-gray-800 rounded-lg">
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
  <p className={`bg-gray-800 p-3 rounded-md ${wordWrap ? "" : "whitespace-nowrap"}`}>
    <b className="text-[17px]">{title}</b> <br /> {value}
  </p>
);
