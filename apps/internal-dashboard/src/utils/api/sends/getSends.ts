import { useQuery } from "@tanstack/react-query";

import { ISending } from "@efg/types";

import { apiRequest } from "../api";

const fetchSends = () =>
  apiRequest<
    (ISending & {
      _count: {
        logs: number;
      };
    })[]
  >({
    path: "/sends",
    method: "GET",
  });

export const useSends = () => useQuery(["sends"], fetchSends, { refetchInterval: 2500 });
