export const envs = {
  discordClientId: process.env.DISCORD_CLIENT_ID!,
  discordRedirectUrl: process.env.DISCORD_REDIRECT_URL!,
  efgApiBaseUrl: process.env.EFG_API_BASEURL!,
  dev: process.env.ENVIRONMENT === "Development",
};
