export enum Flags {
  ADMIN = 1 << 1,

  AddGames = 1 << 2,
  PutGames = 1 << 3,
  GetGames = 1 << 4,
  EditGames = 1 << 5,

  AddSendingLogs = 1 << 6,
  GetSendingLogs = 1 << 7,

  AddCommandLogs = 1 << 8,
  GetCommandLogs = 1 << 9,

  AddServers = 1 << 10,
  GetServers = 1 << 11,
  EditServers = 1 << 12,

  EditUsers = 1 << 13,

  GetCurrencies = 1 << 14,
  EditCurrencies = 1 << 15,
  AddCurrencies = 1 << 16,
}
