import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import { useHasFlags } from "~hooks/useHasFlags";
import { useUser } from "~hooks/useUser";
import { Flags } from "~utils/api/flags";
import { MyAppProps } from "~utils/types";

import "../styles/globals.css";

const queryClient = new QueryClient();

const Auth = ({ requiredFlags, children }: { requiredFlags: Flags[]; children: ReactNode }) => {
  const { user, isLoading } = useUser(false);
  const router = useRouter();

  const canViewPage = useHasFlags(user?.flags ?? 0, ...requiredFlags);

  if (isLoading) return <></>;

  if (!canViewPage) return <div>forbidden</div>;

  if (!isLoading && !canViewPage) {
    router.push("/");
    return null;
  }

  return <>{children}</>;
};

const MyApp = ({ Component, pageProps }: MyAppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {Component.requireAuth ? (
        <Auth requiredFlags={Component.requiredFlags ?? []}>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </QueryClientProvider>
  );
};

export default MyApp;
