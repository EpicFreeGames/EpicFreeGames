import { useQuery } from "@tanstack/react-query";

import { ICounts } from "@efg/types";

import { getActualISOString } from "~utils/getActualISOString";

import { apiRequest } from "../api";

const fetchCounts = () =>
  apiRequest<ICounts>({
    method: "GET",
    path: "/dashboard/counts",
    query: new URLSearchParams({ today: getActualISOString(new Date()) }),
  });

export const useDashboardCounts = () => useQuery(["counts"], fetchCounts);
