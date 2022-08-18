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

  AddUsers = 1 << 17,
  GetUsers = 1 << 15,
  EditUsers = 1 << 14,
  DeleteUsers = 1 << 16,

  GetCurrencies = 1 << 17,
  EditCurrencies = 1 << 18,
  AddCurrencies = 1 << 19,

  GetDashboard = 1 << 20,

  Send = 1 << 21,
  GetSendings = 1 << 22,
  AddSendings = 1 << 23,
  EditSendings = 1 << 24,
  DeleteSendings = 1 << 25,

  ReceiveEvents = 1 << 26,
}
