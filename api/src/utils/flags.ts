export enum Flags {
  ADMIN = 1 << 1,

  PutGames = 1 << 2,
  GetGames = 1 << 3,
  EditGames = 1 << 4,

  AddSendingLogs = 1 << 5,
  GetSendingLogs = 1 << 6,

  AddCommandLogs = 1 << 7,
  GetCommandLogs = 1 << 8,

  AddServers = 1 << 9,
  GetServers = 1 << 10,
  EditServers = 1 << 11,

  EditUsers = 1 << 12,
}
