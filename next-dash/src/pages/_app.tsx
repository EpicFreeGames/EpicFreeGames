import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { IWsMsg, WsMsgTypeBit } from "~utils/api/types";
import toast from "react-hot-toast";
import { useIsBrowser } from "~hooks/useIsBrowser";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const isBrowser = useIsBrowser();

  const ws = useMemo(() => (isBrowser ? new WebSocket("ws://localhost:3010/api") : null), []);

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

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
