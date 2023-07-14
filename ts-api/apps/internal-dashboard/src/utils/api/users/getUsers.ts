import { useQuery } from "@tanstack/react-query";

import { IUser } from "@efg/types";

import { apiRequest } from "../api";

const fetchUsers = () =>
  apiRequest<IUser[]>({
    method: "GET",
    path: "/users",
  });

export const useUsers = () => useQuery(["users"], fetchUsers);
