// all flags: 268435454
export enum Flags {
  AddGames = 1 << 1,
  PutGames = 1 << 2,
  GetGames = 1 << 3,
  EditGames = 1 << 4,
  DeleteGames = 1 << 5,

  AddSendingLogs = 1 << 6,
  GetSendingLogs = 1 << 7,

  AddCommandLogs = 1 << 8,
  GetCommandLogs = 1 << 9,

  AddServers = 1 << 10,
  GetServers = 1 << 11,
  EditServers = 1 << 12,

  AddUsers = 1 << 13,
  GetUsers = 1 << 14,
  EditUsers = 1 << 15,
  DeleteUsers = 1 << 16,

  GetCurrencies = 1 << 17,
  GetLanguages = 1 << 18,
  GetTranslations = 1 << 19,

  GetDashboard = 1 << 20,

  Send = 1 << 21,
  GetSendings = 1 << 22,
  AddSendings = 1 << 23,
  EditSendings = 1 << 24,
  DeleteSendings = 1 << 25,

  ReceiveEvents = 1 << 26,

  GetTokens = 1 << 27,
}

export type Flag = keyof typeof Flags;
