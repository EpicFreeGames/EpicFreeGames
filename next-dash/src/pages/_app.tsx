import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MyAppProps } from "~utils/types";
import { useHasFlags } from "~hooks/useHasFlags";
import { useUser } from "~hooks/useUser";
import { Flags } from "~utils/api/flags";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const Auth = ({ requiredFlags, children }: { requiredFlags: Flags[]; children: ReactNode }) => {
  const { user, isLoading } = useUser(false);

  const canViewPage = useHasFlags(user?.flags ?? 0, ...requiredFlags);

  if (isLoading) return <></>;

  if (!canViewPage) return <div>forbidden</div>;

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
