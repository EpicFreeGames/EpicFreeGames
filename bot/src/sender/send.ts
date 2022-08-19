import { Game } from "~shared/types.ts";
import { logger } from "~shared/utils/logger.ts";

import { hookSender } from "./hook.ts";
import { messageSender } from "./message.ts";
import { HookServer, MessageServer } from "./utils.ts";

type Servers = {
  messageServers: MessageServer[];
  hookServers: HookServer[];
};

export const send = (
  sendingId: string,
  games: Game[],
  { messageServers, hookServers }: Servers
) => {
  hookSender(games, hookServers, sendingId);
  messageSender(games, messageServers, sendingId);

  logger.info("senders started");
};
