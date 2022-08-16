import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { IWsMsg, WsMsgTypeBit } from "~utils/api/types";
import { useIsBrowser } from "./useIsBrowser";

export const useWebsocket = (isAuthenticated: any) => {
  const isBrowser = useIsBrowser();

  const ws = useMemo(
    () => (isBrowser && !!isAuthenticated ? new WebSocket("ws://localhost:3010/api") : null),
    []
  );

  useEffect(() => {
    if (!ws) return;

    ws.onopen = () => console.log("WebSocket connected");

    ws.onmessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data) as IWsMsg;

      if (data.bit === WsMsgTypeBit.Hi) return;

      toast(`${data.desc}${data?.msg ? `: ${data.msg}` : ""}`, {
        position: "bottom-left",
      });
    };
  }, [ws]);
};
