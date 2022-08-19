import { Server } from "ws";

import { WsMsgType, WsMsgTypeBit, WsMsgTypeDesc } from "./types";

export const broadcastWss = (wss: Server, type: WsMsgType, msg?: string) => {
  const data = { bit: WsMsgTypeBit[type], desc: WsMsgTypeDesc[type], msg };
  console.log(
    `\nBroadcasting to ${wss.clients.size} clients\nData: ${JSON.stringify(data, null, 2)}`
  );

  wss.clients.forEach((client) => {
    client.send(JSON.stringify(data));
  });
};
