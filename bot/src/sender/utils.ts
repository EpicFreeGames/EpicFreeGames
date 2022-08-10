import { api } from "~shared/api.ts";
import { SendingLog, Server } from "~shared/types.ts";
import { logger } from "~shared/utils/logger.ts";

export const logLog = (log: SendingLog) =>
  api({
    method: "POST",
    path: `/sends/logs`,
    body: log,
  }).catch((err) => logger.error("failed to save sending log:", err));

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type MessageServer = Server & {
  channelId: string;
};

export type HookServer = Server & {
  webhookId: string;
  webhookToken: string;
};

export const filterServers = (
  unFiltered: Server[]
): { messageServers: MessageServer[]; hookServers: HookServer[]; noServers: boolean } => {
  const messageServers = unFiltered.filter(
    (server) => server.channelId && !server.webhookId && !server.webhookToken
  ) as MessageServer[];

  const hookServers = unFiltered.filter(
    (server) => server.webhookId && server.webhookToken
  ) as HookServer[];

  return { messageServers, hookServers, noServers: !hookServers.length && !messageServers.length };
};
