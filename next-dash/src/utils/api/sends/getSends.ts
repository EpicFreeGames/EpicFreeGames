import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../api";
import { ISending } from "../types";

const fetchSends = () =>
  apiRequest<ISending[]>({
    path: "/sends",
    method: "GET",
  });

export const useSends = () => useQuery(["sends"], fetchSends);
