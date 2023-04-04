import { useQuery } from "@tanstack/react-query";

import { ICurrency } from "@efg/types";

import { apiRequest } from "../api";

const fetchCurrencies = () =>
  apiRequest<ICurrency[]>({
    path: "/currencies",
    method: "GET",
  });

export const useCurrencies = () => useQuery(["currencies"], fetchCurrencies);
