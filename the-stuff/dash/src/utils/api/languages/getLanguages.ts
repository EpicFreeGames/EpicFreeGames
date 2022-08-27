import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "../api";
import { ILanguage } from "../types";

const fetchLanguages = () =>
  apiRequest<ILanguage[]>({
    path: "/languages",
    method: "GET",
  });

export const useLanguages = () => useQuery(["languages"], fetchLanguages);
