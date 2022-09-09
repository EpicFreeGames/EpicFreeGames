import { logger, objToStr } from "@efg/logger";
import { ISendingLog, IServer } from "@efg/types";

import { efgApi } from "./efgApi";

export const logLog = (log: ISendingLog) => {
  efgApi({
    method: "POST",
    path: "/sends/logs",
    body: log,
  }).catch((err) =>
    logger.error([
      "Failed to save sending log",
      `Cause: ${objToStr(err)}`,
      `Sending log: ${objToStr(log)}`,
    ])
  );
};

export type MessageServer = IServer & {
  channelId: string;
};

export type HookServer = IServer & {
  webhookId: string;
  webhookToken: string;
};

export const filterServers = (
  unFiltered: IServer[]
): { messageServers: MessageServer[]; hookServers: HookServer[]; noServers: boolean } => {
  const messageServers = unFiltered.filter(
    (server) => server.channelId && !server.webhookId && !server.webhookToken
  ) as MessageServer[];

  const hookServers = unFiltered.filter(
    (server) => server.webhookId && server.webhookToken
  ) as HookServer[];

  return { messageServers, hookServers, noServers: !hookServers.length && !messageServers.length };
};
