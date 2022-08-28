/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  redirects: async () => [
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
      source: "/support",
      destination: "https://discord.gg/49UQcJe",
      permanent: false,
    },
  ],
  i18n: {
    locales: ["af", "en"],
    defaultLocale: "en",
    localeDetection: true,
  },
};

module.exports = nextConfig;
