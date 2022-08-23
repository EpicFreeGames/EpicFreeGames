/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  redirects: async () => {
    return [
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
        source: "/invite",
        destination:
          "https://discord.com/api/oauth2/authorize?client_id=723239582191190096&permissions=275414927360&scope=bot%20applications.commands",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
