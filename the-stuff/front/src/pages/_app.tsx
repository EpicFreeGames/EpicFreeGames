import type { AppType } from "next/dist/shared/lib/utils";
import { Toaster } from "react-hot-toast";

import { TooltipProvider } from "~components/Tooltip";
import "~styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            color: "#f8fafc",
          },
          position: "top-right",
        }}
      />

      <TooltipProvider>
        <Component {...pageProps} />
      </TooltipProvider>
    </>
  );
};

export default MyApp;
