import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import type { ILanguage } from "@efg/types";

import { NavBar } from "./NavBar";

type Props = {
  title?: string;
  children: ReactNode;
  noTranslations?: boolean;
  languages: ILanguage[];
  env: "Staging" | "Production" | "Development";
};

const desc =
  "A customizable and easy-to-setup Discord bot focused around notifying about free games. Apart from notifying, it also provides your server some cool commands!";

export const Layout = ({ title, children, noTranslations, languages, env }: Props) => {
  const { pathname } = useRouter();
  const isHome = pathname === "/";

  const prod = env === "Production";

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

        {languages.map((language) => (
          <link
            key={language.code}
            rel="alternate"
            hrefLang={language.code}
            href={
              language.code === "en"
                ? `${baseUrl}${!isHome ? pathname : ""}`
                : `${baseUrl}/${language.code}${!isHome ? pathname : ""}`
            }
          />
        ))}

        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${!isHome ? pathname : ""}`} />

        <script
          defer
          src="/stuff/script.js"
          data-api="/stuff/event"
          data-domain={baseUrl.replace("https://", "")}
        />
      </Head>

      <NavBar noTranslations={noTranslations} languages={languages} />

      <main className="mx-auto mt-8 max-w-screen-sm px-3 sm:mt-16">{children}</main>
    </>
  );
};
