import { useQuery } from "@tanstack/react-query";

import { IUser } from "@efg/types";

import { ApiError, apiRequest } from "../api";

const fetchMe = (required = true) =>
  apiRequest<IUser>({
    path: "/users/@me",
    method: "GET",
    redirect40X: required,
  });

export const useMe = (required = true) =>
  useQuery<IUser, ApiError>(["me"], () => fetchMe(required), {
    retry: false,
  });
