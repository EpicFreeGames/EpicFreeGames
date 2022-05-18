import { showNotification, updateNotification } from "@mantine/notifications";
import { ICurrencyWithGuildCount } from "shared";
import { CircleCheck, CircleX } from "tabler-icons-react";
import { request } from ".";
import { IAddCurrencyValues, IUpdateCurrencyValues } from "../../validation/Currencies";

export const addCurrency = async (
  values: IAddCurrencyValues,
  onSuccess: () => void,
  currenctCurrencies?: ICurrencyWithGuildCount[]
): Promise<ICurrencyWithGuildCount[]> => {
  try {
    showNotification({
      id: "add-currency",
      loading: true,
      message: "Adding currency",
    });

    const addedCurrency = await request<ICurrencyWithGuildCount>({
      path: "/currencies",
      method: "POST",
      body: values,
    });

    onSuccess();

    updateNotification({
      id: "add-currency",
      message: "Currency added",
      icon: <CircleCheck />,
      color: "green",
    });

    const filtered = currenctCurrencies?.filter((l) => l.code !== values.code) || [];
    return [...filtered, addedCurrency];
  } catch (err) {
    updateNotification({
      id: "add-currency",
      message: "Failed to add currency",
      icon: <CircleX />,
      color: "red",
    });

    throw err;
  }
};

export const updateCurrency = async (
  code: string,
  values: IUpdateCurrencyValues,
  onSuccess: () => void,
  currenctCurrencies?: ICurrencyWithGuildCount[]
) => {
  try {
    showNotification({
      id: "update-currency",
      loading: true,
      message: "Updating currency",
    });

    const updatedLang = await request<ICurrencyWithGuildCount>({
      path: `/currencies/${code}`,
      method: "PATCH",
      body: values,
    });

    onSuccess();

    updateNotification({
      id: "update-currency",
      message: "Currency updated",
      icon: <CircleCheck />,
      color: "green",
    });

    const filtered = currenctCurrencies?.filter((l) => l.code !== code) || [];
    return [...filtered, updatedLang];
  } catch (err) {
    updateNotification({
      id: "update-currency",
      message: "Failed to update currency",
      icon: <CircleX />,
      color: "red",
    });

    throw err;
  }
};
