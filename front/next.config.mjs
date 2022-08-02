function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  redirects: async () => {
    return [
      {
        source: "/r/website/:path*",
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
});
