export type IUser = {
  id: string;
  discordId: string;
  name: string;
  flags: number;
};

export type IGamePrice = {
  value: number;
  formattedValue: string;
  currencyCode: string;
};

export type IGame = {
  id: string;
  name: string;
  displayName: string;
  imageUrl: string;
  /**
   * Date as an ISO string
   */
  start: string;
  /**
   * Date as an ISO string
   */
  end: string;
  path: string;
  confirmed: boolean;
  prices: IGamePrice[];
  sendingId: string;
};

export type ILanguage = {
  code: string;
  englishName: string;
  nativeName: string;
};

export type ICurrency = {
  id: string;
  code: string;
  name: string;
  apiValue: string;
  inFrontOfPrice: string;
  afterPrice: string;
};

export type IServer = {
  id: string;
  roleId: string | null;
  channelId: string | null;
  threadId: string | null;
  languageCode: ILanguage["code"];
  currency: ICurrency;
  currencyCode: ICurrency["code"];
  createdAt: number;
};

export type ICounts = {
  total: number;
  sendable: number;
  hasWebhook: number;
  hasRole: number;
  hasThread: number;
  hasChangedLanguage: number;
  hasChangedCurrency: number;
  hasOnlyChannel: number;
  webhookAdoption: string;
  totalCommands: number;
};

export type ISendingLog = {
  id: string;
  type: "MESSAGE" | "WEBHOOK";
};

export type ISending = {
  id: string;
  logs: never;
  games: IGame[] | null;
  status: "IDLE" | "SENDING" | "SENT";
};

export enum WsMsgType {
  NotificationSuccess = "NotificationSuccess",
  NotificationFailure = "NotificationFailure",
  Command = "Command",
  ChannelModify = "ChannelModify",
  ChannelDelete = "ChannelDelete",
  WebhookConvert = "WebhookConvert",
  ThreadModify = "ThreadModify",
  ThreadDelete = "ThreadDelete",
  RoleModify = "RoleModify",
  RoleDelete = "RoleDelete",
  LanguageModify = "LanguageModify",
  CurrencyModify = "CurrencyModify",
  Hi = "Hi",
}

export enum WsMsgTypeBit {
  NotificationSuccess = 1 << 0,
  NotificationFailure = 1 << 1,
  Command = 1 << 2,
  ChannelModify = 1 << 3,
  ChannelDelete = 1 << 4,
  WebhookConvert = 1 << 5,
  ThreadModify = 1 << 6,
  ThreadDelete = 1 << 7,
  RoleModify = 1 << 8,
  RoleDelete = 1 << 9,
  LanguageModify = 1 << 10,
  CurrencyModify = 1 << 11,
  Hi = 1 << 12,
}

export enum WsMsgTypeDesc {
  NotificationSuccess = "Notification posted successfully",
  NotificationFailure = "Failed to post notification",
  Command = "Command executed",
  ChannelModify = "Channel modified",
  ChannelDelete = "Channel deleted",
  WebhookConvert = "Converted to webhook",
  ThreadModify = "Thread modified",
  ThreadDelete = "Thread deleted",
  RoleModify = "Role modified",
  RoleDelete = "Role deleted",
  LanguageModify = "Language modified",
  CurrencyModify = "Currency modified",
  Hi = "Hi",
}

export type IWsMsg = {
  bit: WsMsgTypeBit;
  desc: WsMsgTypeDesc;
  msg?: string;
};

export enum Flags {
  ADMIN = 1 << 1,

  AddGames = 1 << 2,
  PutGames = 1 << 3,
  GetGames = 1 << 4,
  EditGames = 1 << 5,
  DeleteGames = 1 << 6,

  AddSendingLogs = 1 << 7,
  GetSendingLogs = 1 << 8,

  AddCommandLogs = 1 << 9,
  GetCommandLogs = 1 << 10,

  AddServers = 1 << 11,
  GetServers = 1 << 12,
  EditServers = 1 << 13,

  EditUsers = 1 << 14,

  GetCurrencies = 1 << 15,
  EditCurrencies = 1 << 16,
  AddCurrencies = 1 << 17,

  GetDashboard = 1 << 18,

  Send = 1 << 19,
  GetSendings = 1 << 20,
  AddSendings = 1 << 21,
  EditSendings = 1 << 22,

  ReceiveEvents = 1 << 23,
}
