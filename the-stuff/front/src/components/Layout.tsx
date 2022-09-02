import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import { languages } from "~languages";

import { NavBar } from "./NavBar";

type Props = {
  title?: string;
  children: ReactNode;
  noTranslations?: boolean;
  env: "Staging" | "Production" | "Development";
};

const desc =
  "A customizable and easy-to-setup Discord bot focused around notifying about free games. Apart from notifying, it also provides your server some cool commands!";

export const Layout = ({ title, children, noTranslations, env }: Props) => {
  const { pathname } = useRouter();
  const isHome = pathname === "/";

  const prod = env === "Production";
  const dev = env === "Development";

  const baseUrl = `${`https://${prod ? "" : "staging."}epicfreegames.net`}`;
  const botName = prod ? "EpicFreeGames" : "Staging-EpicFreeGames";

  return (
    <>
      <Head>
        <title>{`${title ? `${title} - ` : ""}${botName}`}</title>

        <meta name="application-name" content={botName} id="app-name" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={botName} />
        <meta name="twitter:description" content={desc} />

        <meta name="description" content={desc} key="description" />

        <meta property="og:title" content={botName} key="og:title" />
        <meta property="og:description" content={desc} key="og:description" />

        <meta
          property="og:image"
          content={`${baseUrl}/assets/images/logos/Production.png`}
          key="og:image"
        />
        <meta property="og:image:type" content="image/png" key="og:image:type" />
        <meta property="og:image:width" content="180" key="og:image:width" />
        <meta property="og:image:height" content="180" key="og:image:width" />
        <meta property="og:image:alt" content="EpicFreeGames logo" key="og:image:alt" />

        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:url" content={baseUrl} key="og:url" />

        <meta property="og:site_name" content={botName} key="og:site_name" />

        {prod ? (
          <meta name="robots" content="index, follow" key="robots" />
        ) : (
          <meta name="robots" content="noindex" />
        )}
        <meta
          name="keywords"
          content="free games discord bot, free discord bot, free games, discord bot, free games, free epic games"
          id="keywords"
        />

        {[...languages].map(([code]) => (
          <link
            key={code}
            rel="alternate"
            hrefLang={code}
            href={
              code === "en"
                ? `${baseUrl}${!isHome ? pathname : ""}`
                : `${baseUrl}/${code}${!isHome ? pathname : ""}`
            }
          />
        ))}

        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${!isHome ? pathname : ""}`} />

        {prod ? (
          <script
            async
            defer
            data-website-id="b0e0d055-8b7b-4a4e-a182-34f26fb6dccb"
            src="https://a7s.epicfreegames.net/umami.js"
          />
        ) : (
          !dev && (
            <script
              async
              defer
              data-website-id="351689c3-d25d-4b03-843a-da005b73246b"
              src="https://a7s.epicfreegames.net/umami.js"
            />
          )
        )}
      </Head>

      <NavBar noTranslations={noTranslations} />

      <main className="mx-auto mt-8 max-w-screen-sm px-3 sm:mt-16">{children}</main>
    </>
  );
};
