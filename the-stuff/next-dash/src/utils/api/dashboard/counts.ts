import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "../api";
import { ICounts } from "../types";

const fetchCounts = () =>
  apiRequest<ICounts>({
    method: "GET",
    path: "/dashboard/counts",
  });

export const useDashboardCounts = () => useQuery(["counts"], fetchCounts);
