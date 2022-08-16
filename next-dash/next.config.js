/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  redirects: async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.EFG_API_BASE_URL}/:path*`,
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
