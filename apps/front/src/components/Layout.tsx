import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { ReactNode } from "react";

import type { ILanguage } from "@efg/types";

import { NavBar } from "./NavBar";

type Props = {
  title?: string;
  children: ReactNode;
  translations: Record<string, string>;
  languages: ILanguage[];
  env: "Staging" | "Production" | "Development";
};

const desc =
  "A customizable and easy-to-setup Discord bot focused around notifying about free games. Apart from notifying, it also provides your server some cool commands!";

export const Layout = ({ title, children, translations, languages, env }: Props) => {
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

        <meta name="description" content={desc} key="description" />

        <link rel="icon" type="image/png" href={`/assets/images/logos/${env}.png`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={botName} />
        <meta name="twitter:description" content={desc} />

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
          content="free games discord bot, free discord bot, free games, discord bot, free games, free epic games, epicfreegames"
          id="keywords"
        />

        <AltLanguages baseUrl={baseUrl} pathname={pathname} isHome={isHome} />

        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${!isHome ? pathname : ""}`} />
      </Head>

      <Script
        strategy="afterInteractive"
        src="/stuff/script.js"
        data-api="/stuff/event"
        data-domain={baseUrl.replace("https://", "")}
      ></Script>

      <NavBar translations={translations} languages={languages} />

      <main className="mx-auto mt-[3rem] max-w-screen-sm px-3 sm:mt-[5rem]">{children}</main>
    </>
  );
};

type AltLanguagesProps = {
  isHome: boolean;
  pathname: string;
  baseUrl: string;
};

const AltLanguages = ({ baseUrl, isHome, pathname }: AltLanguagesProps) => (
  <>
    {/* en */}
    <link key="en" rel="alternate" hrefLang="en" href={`${baseUrl}${isHome ? pathname : ""}`} />

    {/* pl */}
    <link key="pl" rel="alternate" hrefLang="pl" href={`${baseUrl}/pl${!isHome ? pathname : ""}`} />

    {/* es and es-ES points to the same location */}
    <link
      key="es"
      rel="alternate"
      hrefLang="es"
      href={`${baseUrl}/es-ES${!isHome ? pathname : ""}`}
    />
    <link
      key="es-ES"
      rel="alternate"
      hrefLang="es-ES"
      href={`${baseUrl}/es-ES${!isHome ? pathname : ""}`}
    />

    {/* vi */}
    <link key="vi" rel="alternate" hrefLang="vi" href={`${baseUrl}/vi${!isHome ? pathname : ""}`} />

    {/* zh and zh-TW points to the same location */}
    <link
      key="zh"
      rel="alternate"
      hrefLang="zh"
      href={`${baseUrl}/zh-TW${!isHome ? pathname : ""}`}
    />
    <link
      key="zh-TW"
      rel="alternate"
      hrefLang="zh-TW"
      href={`${baseUrl}/zh-TW${!isHome ? pathname : ""}`}
    />
  </>
);
