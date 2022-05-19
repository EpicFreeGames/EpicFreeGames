import { ICurrencyWithGuildCount } from "shared";
import { request } from ".";
import { IAddCurrencyValues, IUpdateCurrencyValues } from "../validation/Currencies";
import toast from "react-hot-toast";

export const addCurrency = async (
  values: IAddCurrencyValues,
  onSuccess: () => void,
  currenctCurrencies?: ICurrencyWithGuildCount[]
): Promise<ICurrencyWithGuildCount[]> =>
  toast.promise(
    (async () => {
      const addedCurrency = await request<ICurrencyWithGuildCount>({
        path: "/currencies",
        method: "POST",
        body: values,
      });

      onSuccess();

      const filtered = currenctCurrencies?.filter((l) => l.code !== values.code) || [];
      return [...filtered, addedCurrency];
    })(),
    {
      loading: "Adding currency",
      success: "Currency added",
      error: "Failed to add currency",
    }
  );

export const updateCurrency = async (
  code: string,
  values: IUpdateCurrencyValues,
  onSuccess: () => void,
  currenctCurrencies?: ICurrencyWithGuildCount[]
): Promise<ICurrencyWithGuildCount[]> =>
  toast.promise(
    (async () => {
      const updatedLang = await request<ICurrencyWithGuildCount>({
        path: `/currencies/${code}`,
        method: "PATCH",
        body: values,
      });

      onSuccess();

      const filtered = currenctCurrencies?.filter((l) => l.code !== code) || [];
      return [...filtered, updatedLang];
    })(),
    {
      loading: "Updating currency",
      success: "Currency updated",
      error: "Failed to update currency",
    }
  );
