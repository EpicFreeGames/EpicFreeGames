import { useQuery } from "@tanstack/react-query";
import { ApiError, apiRequest } from "./api";

const fetchWebsocketAddress = () => apiRequest<string>("/ws", "GET");

export const useWsAddress = () => useQuery<string, ApiError>(["wsAddress"], fetchWebsocketAddress);
