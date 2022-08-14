import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../api";
import { ICurrency } from "../types";

const fetchCurrencies = () => apiRequest<ICurrency[]>("/currencies", "GET");

export const useCurrencies = () => useQuery(["currencies"], fetchCurrencies);
