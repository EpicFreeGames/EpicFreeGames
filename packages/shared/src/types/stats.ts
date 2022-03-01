import { IGuild } from "..";

export interface ISendingStats {
  speed: number;
  sent: number;
  target: number;
  elapsedTime: string;
  eta: string;
}

export interface IFinishedSendingStats {
  averageSpeed: number;
  elapsedTime: string;
  sentCount: number;
}

export interface IStats {
  guildCount: number | null;
  dbGuildCount: number;
  hasWebhook: number;
  hasOnlyChannel: number;
  hasSetRole: number;
  hasChangedLanguage: number;

  commandsRanIn: {
    lastHour: number;
    lastDay: number;
    last7days: number;
    last30days: number;
  };

  avgCommandsIn: {
    anHour: number;
    aDay: number;
  };
}

export interface TopTenGuild {
  id: string;
  name: string;
  memberCount: number;
  owner: string;
  dbInfo: IGuild | null;
}

export interface StatsResponse {
  guildCount: number;
  topTenGuilds: TopTenGuild[];
}
