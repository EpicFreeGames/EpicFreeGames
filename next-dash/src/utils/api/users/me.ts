import { useQuery } from "@tanstack/react-query";
import { ApiError, apiRequest } from "../api";
import { IUser } from "../types";

const fetchMe = () => apiRequest<IUser>("/users/@me", "GET");

export const useMe = () => useQuery<IUser, ApiError>(["me"], fetchMe);
