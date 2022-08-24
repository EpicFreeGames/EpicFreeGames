// all flags = 134217726
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
  EditCurrencies = 1 << 18,
  AddCurrencies = 1 << 19,
  DeleteCurrencies = 1 << 20,

  GetDashboard = 1 << 21,

  Send = 1 << 22,
  GetSendings = 1 << 23,
  AddSendings = 1 << 24,
  EditSendings = 1 << 25,
  DeleteSendings = 1 << 26,

  ReceiveEvents = 1 << 27,
}

export type Flag = keyof typeof Flags;
