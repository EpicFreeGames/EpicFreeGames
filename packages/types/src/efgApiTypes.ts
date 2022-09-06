export type IUser = {
  id: string;
  identifier: string;
  bot: boolean;
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

export type IGameStatus = "up" | "free" | "gone";
export type IGameWithStatus = IGame & {
  status: IGameStatus;
};

export type ILanguage = {
  code: string;
  englishName: string;
  nativeName: string;
  serverCount?: number;
};

export type ICurrency = {
  code: string;
  name: string;
  apiValue: string;
  inFrontOfPrice: string;
  afterPrice: string;
  serverCount?: number;
};

export type IServer = {
  id: string;
  roleId: string | null;
  channelId: string | null;
  threadId: string | null;
  webhookId: string | null;
  webhookToken: string | null;
  language: ILanguage;
  currency: ICurrency;
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
  target: number;
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
