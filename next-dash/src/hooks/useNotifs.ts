import { useEffect } from "react";
import toast from "react-hot-toast";
import { IWsMsg, WsMsgTypeBit } from "~utils/api/types";
import { useWsAddress } from "~utils/api/websocket";
import { useIsBrowser } from "./useIsBrowser";

type Props = {
  isAuthenticated: boolean;
};

export const useNotifs = ({ isAuthenticated }: Props) => {
  const isBrowser = useIsBrowser();
  const { data: wsAddress } = useWsAddress();

  useEffect(() => {
    if (!isBrowser || !wsAddress || !isAuthenticated) return;

    const ws = new WebSocket(wsAddress);

    ws.onopen = () => console.log("WebSocket connected");

    ws.onmessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data) as IWsMsg;

      if (data.bit === WsMsgTypeBit.Hi) return;

      toast(`${data.desc}${data?.msg ? `: ${data.msg}` : ""}`, {
        position: "bottom-left",
        style: {
          backgroundColor: "rgb(31 41 55)",
        },
      });
    };

    return () => {
      ws?.close();
    };
  }, [wsAddress, isBrowser, isAuthenticated]);
};
