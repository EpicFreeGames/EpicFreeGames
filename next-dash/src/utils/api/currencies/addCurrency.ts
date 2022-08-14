import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, apiRequest } from "../api";
import { ICurrency } from "../types";

export type AddCurrencyProps = Omit<ICurrency, "id">;

const addCurrencyRequest = (props: AddCurrencyProps) =>
  apiRequest<ICurrency>("/currencies", "POST", props);

export const useAddCurrencyMutation = () => {
  const qc = useQueryClient();

  const mutation = useMutation<ICurrency, ApiError, AddCurrencyProps, ICurrency>(
    addCurrencyRequest,
    {
      onSuccess: () => {
        qc.invalidateQueries(["currencies"]);
      },
    }
  );

  return mutation;
};
