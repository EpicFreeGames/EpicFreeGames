import http from "http";
import { Server, WebSocket } from "ws";

import { ITokenPayload } from "../auth/jwt/types";
import { socketAuth } from "../auth/socketAuth";
import { WsMsgTypeBit, WsMsgTypeDesc } from "./types";

export const handleWebsocketConnection =
  (wss: Server) => (ws: WebSocket, accessTokenPayload: ITokenPayload) => {
    ws.send(JSON.stringify({ bit: WsMsgTypeBit.Hi, desc: WsMsgTypeDesc.Hi }));
  };

export const createWs = (server: http.Server) => {
  const wss = new WebSocket.Server({ noServer: true });

  wss.on("connection", handleWebsocketConnection(wss));

  server.on("upgrade", async (req, socket, head) => {
    const { hasAccess, accessTokenPayload } = await socketAuth(req);
    if (!hasAccess || !accessTokenPayload) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      return socket.destroy();
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req, accessTokenPayload);
    });
  });

  return wss;
};
