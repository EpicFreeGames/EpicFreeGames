import NextAuth from "next-auth/next";
import DiscordProvider from "next-auth/providers/discord";
import { adminId, collaborators, discordClientId, discordClientSecret } from "../../../utils/envs";

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: discordClientId,
      clientSecret: discordClientSecret,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
    }),
  ],

  callbacks: {
    async jwt(props) {
      props.token.isAdmin = props.token.sub === adminId;
      props.token.isCollaborator = collaborators.includes(props.token.sub || "");

      return props.token;
    },

    async session(props) {
      props.session.user.isAdmin = props.token.isAdmin;
      props.session.user.isCollaborator = props.token.isCollaborator;

      return props.session;
    },
  },
});
