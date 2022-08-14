import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, apiRequest } from "../api";
import { ICurrency } from "../types";

export type EditCurrencyProps = {
  currencyId: string;
  updateData: Partial<ICurrency>;
};

const editCurrencyRequest = ({ currencyId, updateData }: EditCurrencyProps) =>
  apiRequest<ICurrency>(`/currencies/${currencyId}`, "PATCH", updateData);

export const useEditCurrencyMutation = () => {
  const qc = useQueryClient();

  const mutation = useMutation<ICurrency, ApiError, EditCurrencyProps, ICurrency>(
    editCurrencyRequest,
    {
      onSuccess: () => {
        qc.invalidateQueries(["currencies"]);
      },
    }
  );

  return mutation;
};
