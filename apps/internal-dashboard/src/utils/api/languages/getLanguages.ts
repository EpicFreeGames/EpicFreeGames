import { useQuery } from "@tanstack/react-query";

import { ILanguage } from "@efg/types";

import { apiRequest } from "../api";

const fetchLanguages = () =>
  apiRequest<ILanguage[]>({
    path: "/languages",
    method: "GET",
  });

export const useLanguages = () => useQuery(["languages"], fetchLanguages);
