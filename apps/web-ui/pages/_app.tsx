import { MantineProvider, ColorSchemeProvider, ColorScheme } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { AppProps } from "next/app";
import { ReactNode, useState } from "react";
import { getCookie, setCookies } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import { NotificationsProvider } from "@mantine/notifications";
import { SessionProvider, useSession } from "next-auth/react";

const App = (props: AppProps & { colorScheme: ColorScheme }) => {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookies("mantine-color-scheme", nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  useHotkeys([["mod+j", () => toggleColorScheme()]]);

  return (
    <>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          theme={{
            colorScheme,
            breakpoints: {
              mobile: 600,
              tablet: 1060,
            },
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <NotificationsProvider>
            <SessionProvider session={pageProps?.session}>
              {(Component as any).auth ? (
                <Auth>
                  <Component {...pageProps} />
                </Auth>
              ) : (
                <Component {...pageProps} />
              )}
            </SessionProvider>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});

const Auth = ({ children }: { children: ReactNode }) => {
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <></>;
  }

  return <>{children}</>;
};

export default App;
