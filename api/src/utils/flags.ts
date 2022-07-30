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
}
