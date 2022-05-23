import { IConfig } from "./types";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export const config: IConfig = {
  crowdinDistHash: process.env.CROWDIN_DIST_HASH || "",

  interactionsPort: Number(process.env.INTERACTIONS_PORT) || 3000,
  senderPort: Number(process.env.SENDER_PORT) || 3000,

  infoHookUrl: process.env.INFO_HOOK_URL || "",
  loggingHookUrl: process.env.LOG_HOOK_URL || "",
  senderHookUrl: process.env.SENDER_HOOK_URL || "",

  senderUrl: process.env.SENDER_URL || "",

  botId: process.env.BOT_ID || "",
  botToken: process.env.BOT_TOKEN || "",
  botPublicKey: process.env.BOT_PUBLIC_KEY || "",

  mongoUrl: process.env.MONGO_URI || "",

  topGGAuth: process.env.TOP_GG_AUTH || "",

  adminIds: process.env.ADMIN_IDS?.split(",") || [""],
  guildId: process.env.GUILD_ID || "",

  prod: process.env.PROD === "1",

  webUi: {
    discordClientId: process.env.DISCORD_CLIENT_ID || "",
    discordClientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    nextAuthSecret: process.env.NEXT_AUTH_SECRET || "",
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  },
};
