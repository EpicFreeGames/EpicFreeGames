import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../api";
import { ICurrency } from "../types";

const fetchCurrencies = () =>
  apiRequest<ICurrency[]>({
    path: "/currencies",
    method: "GET",
  });

export const useCurrencies = () => useQuery(["currencies"], fetchCurrencies);
