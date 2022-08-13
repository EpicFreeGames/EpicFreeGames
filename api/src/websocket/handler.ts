import { Server, WebSocket } from "ws";

export const handleWebsocketConnection = (wss: Server) => (ws: WebSocket) => ws.send("hi");
