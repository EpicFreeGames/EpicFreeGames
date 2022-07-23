import { GatewayIntents } from "discordeno";
import { config as dotenvConfig } from "dotenv";
import { z } from "zod";
import { logger } from "~logger";

const env = dotenvConfig();

const Intents: GatewayIntents =
  GatewayIntents.MessageContent |
  GatewayIntents.GuildMessages |
  GatewayIntents.DirectMessages |
  GatewayIntents.Guilds;

const envSchema = z.object({
  BOT_TOKEN: z.string().refine((v) => !!BigInt(atob(v.split(".")[0]))),

  REDISHOST: z.string(),
  REDISPORT: z.string().transform(Number),

  GATEWAY_PROXY_URL: z.string(),
  GATEWAY_PROXY_PORT: z.string().default("3000").transform(Number),
  GATEWAY_PROXY_AUTH: z.string(),

  BOT_URL: z.string(),
  BOT_PORT: z.string().default("3000").transform(Number),
  BOT_AUTH: z.string(),

  REST_PROXY_URL: z.string(),
  REST_PROXY_PORT: z.string().default("3000").transform(Number),
  REST_PROXY_AUTH: z.string(),

  DEV_GUILD_ID: z.string().optional(),

  API_TOKEN: z.string(),
  API_BASEURL: z.string(),

  GIFS_VOTE: z.string(),
  GIFS_INVITE: z.string(),
  PHOTOS_THUMBNAIL: z.string(),

  LINKS_BOT_INVITE: z.string(),
  LINKS_SERVER_INVITE: z.string(),
  LINKS_VOTE: z.string(),
  LINKS_WEBSITE: z.string(),
  LINKS_COMMANDS: z.string(),
  LINKS_BROWSER_REDIRECT: z.string(),
  LINKS_LAUNCHER_REDIRECT: z.string(),

  NAME_ON_WEBHOOK: z.string(),
  WEBHOOK_BASE64_PHOTO: z.string(),
});

const result = envSchema.safeParse(
  Deno.env.get("ENVIRONMENT") === "development" ? env : Deno.env.toObject()
);

if (!result.success) {
  logger.error(
    "❌ Invalid environment variables:",
    JSON.stringify(result.error.format(), null, 4)
  );

  Deno.exit(1);
}

export const config = {
  ...result.data,
  BOT_ID: BigInt(atob(result.data.BOT_TOKEN.split(".")[0])),
  Intents,
};
