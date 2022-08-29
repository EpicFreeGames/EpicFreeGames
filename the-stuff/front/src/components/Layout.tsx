import Head from "next/head";
import { ReactNode } from "react";

import { NavBar } from "./NavBar";

type Props = {
  title: string;
  children: ReactNode;
};

const desc =
  "A customizable Discord bot notifies your server about new free games on the Epic Games store.";

export const Layout = ({ title, children }: Props) => (
  <>
    <Head>
      <title>{`${title} - EpicFreeGames`}</title>

      <meta name="application-name" content="EpicFreeGames" id="app-name" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="EpicFreeGames" />
      <meta name="twitter:description" content={desc} />

      <meta name="description" content={desc} key="description" />

      <meta property="og:title" content="EpicFreeGames" key="og:title" />
      <meta property="og:description" content={desc} key="og:description" />
      <meta
        property="og:image"
        content="https://epicfreegames.net/assets/logo.png"
        key="og:image"
      />
      <meta property="og:image:type" content="image/png" key="og:image:type" />
      <meta property="og:image:width" content="180" key="og:image:width" />
      <meta property="og:image:height" content="180" key="og:image:width" />
      <meta property="og:image:alt" content="EpicFreeGames logo" key="og:image:alt" />

      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:url" content="https://epicfreegames.net" key="og:url" />

      <meta property="og:site_name" content="EpicFreeGames" key="og:site_name" />

      <meta name="robots" content="index, follow" key="robots" />
      <meta
        name="keywords"
        content="free games discord bot, free discord bot, free games, discord bot, free games, free epic games"
        id="keywords"
      />
    </Head>

    <NavBar />

    <main className="mx-auto mt-8 max-w-screen-sm px-3 sm:mt-16">{children}</main>
  </>
);
