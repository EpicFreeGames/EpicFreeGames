export interface ISendingStats {
  id: string;
  speed: number;
  sent: number;
  target: number;
  eta: number;
  startedAt: number;
  gameNames: string[];
}

export interface IFinishedSendingStats {
  id: string;
  averageSpeed: number;
  sentCount: number;
  startedAt: number;
  finishedAt: number;
  gameNames: string[];
}

export interface IStats {
  dbGuildCount: number;
  hasWebhook: number;
  hasOnlyChannel: number;
  hasSetRole: number;
  hasChangedLanguage: number;
  hasChangedCurrency: number;
  hasSetThread: number;
}

export interface ICommandsRanIn {
  allTime: number;
  lastHour: number;
  lastDay: number;
  last7days: number;
  last30days: number;

  avgCommandsIn: {
    anHour: number;
    aDay: number;
  };
}
