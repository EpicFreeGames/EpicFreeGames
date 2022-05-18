import NextAuth from "next-auth/next";
import DiscordProvider from "next-auth/providers/discord";
import { discordClientId, discordClientSecret } from "../../../utils/envs";

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: discordClientId,
      clientSecret: discordClientSecret,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
    }),
  ],
});
