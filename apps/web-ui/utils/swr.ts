import { config } from "config";
import { ICommandsRanIn, IStats } from "shared";
import useSWR from "swr";

export const fetcher = async (url: string) =>
  fetch(`${config.webUi.apiUrl}${url}`, {
    credentials: "same-origin",
  }).then((res) => res.json());

export const useGuildStats = () => {
  const { data, error } = useSWR<IStats>("/dashboard/guild-stats", fetcher, {
    refreshInterval: 5000,
  });

  return { guildStats: data, isLoading: !error && !data, error };
};

export const useCommandStats = () => {
  const { data, error } = useSWR<ICommandsRanIn>("/dashboard/command-stats", fetcher, {
    refreshInterval: 5000,
  });

  return { commandStats: data, isLoading: !error && !data, error };
};
