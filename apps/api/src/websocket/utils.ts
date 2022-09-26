import { Server } from "ws";

import { logger } from "@efg/logger";
import { objToStr } from "@efg/shared-utils";

import { WsMsgType, WsMsgTypeBit, WsMsgTypeDesc } from "./types";

export const broadcastWss = (wss: Server, type: WsMsgType, msg?: string) => {
  const data = { bit: WsMsgTypeBit[type], desc: WsMsgTypeDesc[type], msg };
  logger.debug(
    [`Broadcasting to ${wss.clients.size} clients`, `Data: ${objToStr(data)}`].join("\n")
  );

  wss.clients.forEach((client) => {
    client.send(JSON.stringify(data));
  });
};
