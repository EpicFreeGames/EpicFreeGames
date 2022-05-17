import { config } from "config";
import NextAuth from "next-auth/next";
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: config.webUi.discordClientId,
      clientSecret: config.webUi.discordClientSecret,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
    }),
  ],
});
