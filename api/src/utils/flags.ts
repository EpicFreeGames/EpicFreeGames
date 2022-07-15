export enum Flags {
  ADMIN = 1 << 1,

  PutGames = 1 << 2,
  GetGames = 1 << 3,

  AddSendingLogs = 1 << 4,
  GetSendingLogs = 1 << 5,

  AddCommandLogs = 1 << 6,
  GetCommandLogs = 1 << 7,

  AddServers = 1 << 8,
  GetServers = 1 << 9,
  EditServers = 1 << 10,

  EditUsers = 1 << 11,
}
