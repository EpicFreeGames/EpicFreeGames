export interface ISendingStats {
  speed: number;
  sent: number;
  target: number;
  eta: number;
  startedAt: number;
  gameNames: string[];
}

export interface IFinishedSendingStats {
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
  lastHour: number;
  lastDay: number;
  last7days: number;
  last30days: number;

  avgCommandsIn: {
    anHour: number;
    aDay: number;
  };
}
