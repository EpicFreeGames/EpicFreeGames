export type IUser = {
  id: string;
  discordId: string;
  name?: string;
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
