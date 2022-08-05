import { Game, Server } from "~shared/types.ts";
import { logger } from "~shared/utils/logger.ts";
import { channelSender } from "./channel.ts";
import { hookSender } from "./hook.ts";

export type HookServer = Server & { webhookId: string; webhookToken: string; channelId: string };
export type ChannelServer = Server & { channelId: string };

type Stuff = {
  servers: {
    hook: HookServer[];
    noHook: ChannelServer[];
  };
  games: Game[];
};

export const send = (sendingId: string, stuff: Stuff) => {
  const { servers, games } = stuff;

  hookSender(games, servers.hook, sendingId);
  channelSender(games, servers.noHook, sendingId);

  logger.info("senders started");

  return true;
};
