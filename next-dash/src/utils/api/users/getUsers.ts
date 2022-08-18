import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../api";
import { IUser } from "../types";

const fetchUsers = () =>
  apiRequest<IUser[]>({
    method: "GET",
    path: "/users",
  });

export const useUsers = () => useQuery(["users"], fetchUsers);
