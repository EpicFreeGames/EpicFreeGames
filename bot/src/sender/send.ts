import { api } from "../api.ts";
import { Game, Server } from "../types.ts";
import { logger } from "../utils/logger.ts";
import { channelSender } from "./channel.ts";
import { hookSender } from "./hook.ts";

export type HookServer = Server & { webhookId: string; webhookToken: string; channelId: string };
export type ChannelServer = Server & { channelId: string };

type ToSend = {
  servers: {
    hook: HookServer[];
    noHook: ChannelServer[];
  };
  games: Game[];
};

export const send = async (sendingId?: string) => {
  const { error, data: toSend } = await api<ToSend>({
    method: "GET",
    path: `/sends/to-send${sendingId ? `?sendingId=${sendingId}` : ""}`,
  });

  if (error) {
    logger.error(error);
    return false;
  }

  const { servers, games } = toSend;

  if (!servers.hook.length && !servers.noHook.length) {
    logger.info("no servers to send to");
    return false;
  }

  const innerSendingId = sendingId || Math.random().toString().slice(0, 15);

  hookSender(games, servers.hook, innerSendingId);
  channelSender(games, servers.noHook, innerSendingId);

  logger.info("senders started");

  return true;
};
