import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://epicfreegames.net",
  integrations: [tailwind(), sitemap(), robotsTxt({
    policy: [{
      userAgent: "*",
      ...(process.env.NODE_ENV !== "production" && {
        disallow: "/"
      })
    }],
    sitemapBaseFileName: "sitemap-index"
  }), react()]
});