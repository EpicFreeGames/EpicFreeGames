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
    ];
  },
};

module.exports = nextConfig;
