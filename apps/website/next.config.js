/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  redirects: async () => [
    {
      source: "/r/browser/p/c9e146fa85d74402a2989001508ecd16",
      destination: "https://epicgames.com/p/spirit-of-the-north-f58a66",
      permanent: false,
    },
    {
      source: "/r/launcher/p/c9e146fa85d74402a2989001508ecd16",
      destination: "com.epicgames.launcher://store/p/spirit-of-the-north-f58a66",
      permanent: false,
    },
    {
      source: "/r/browser/:path*",
      destination: "https://epicgames.com/:path*",
      permanent: false,
    },
    {
      source: "/r/launcher/:path*",
      destination: "com.epicgames.launcher://store/:path*",
      permanent: false,
    },
    {
      source: "/invite-staging",
      destination:
        "https://discord.com/api/oauth2/authorize?client_id=723239582191190096&permissions=275414927360&scope=bot%20applications.commands",
      permanent: false,
    },
    {
      source: "/invite",
      destination:
        "https://discord.com/api/oauth2/authorize?client_id=719806770133991434&permissions=275414927360&scope=bot%20applications.commands",
      permanent: false,
    },
    {
      source: "/discord",
      destination: "https://discord.gg/49UQcJe",
      permanent: false,
    },
  ],
  rewrites: async () => [
    {
      source: "/stuff/script.js",
      destination: "https://a7s.epicfreegames.net/js/script.js",
    },
    {
      source: "/stuff/event",
      destination: "https://a7s.epicfreegames.net/api/event",
    },
  ],
  i18n: {
    locales: ["en", "pl", "es-ES", "vi", "zh-TW", "af"],
    defaultLocale: "en",
    localeDetection: true,
  },
};

module.exports = nextConfig;
