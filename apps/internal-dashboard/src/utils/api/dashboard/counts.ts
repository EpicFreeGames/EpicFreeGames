import { useQuery } from "@tanstack/react-query";

import { ICounts } from "@efg/types";

import { apiRequest } from "../api";

const fetchCounts = () =>
  apiRequest<ICounts>({
    method: "GET",
    path: "/dashboard/counts",
  });

export const useDashboardCounts = () => useQuery(["counts"], fetchCounts);
