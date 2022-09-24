import type { AppType } from "next/dist/shared/lib/utils";
import { Toaster } from "react-hot-toast";

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

      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
