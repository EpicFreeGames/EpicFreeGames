import { IStats, ICommandsRanIn, ILanguageWithGuildCount, ICurrencyWithGuildCount } from "shared";
import useSWR from "swr";
import { fetcher } from "../utils/requests";

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

export const useLanguages = () => {
  const { data, error } = useSWR<ILanguageWithGuildCount[]>("/languages", fetcher, {
    refreshInterval: 5000,
  });

  return { languages: data, isLoading: !error && !data, error };
};

export const useCurrencies = () => {
  const { data, error } = useSWR<ICurrencyWithGuildCount[]>("/currencies", fetcher, {
    refreshInterval: 5000,
  });

  return { currencies: data, isLoading: !error && !data, error };
};
