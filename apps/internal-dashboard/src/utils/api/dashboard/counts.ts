import { useQuery } from "@tanstack/react-query";

import { ICounts } from "@efg/types";

import { apiRequest } from "../api";

const fetchCounts = () =>
  apiRequest<ICounts>({
    method: "GET",
    path: "/dashboard/counts",
    query: new URLSearchParams({ today: new Date().toISOString() }),
  });

export const useDashboardCounts = () => useQuery(["counts"], fetchCounts);
