import { GatewayIntents } from "discordeno";
import { z } from "zod";
import { getBase64Image } from "./utils/getBase64Image.ts";

const Intents: GatewayIntents = GatewayIntents.DirectMessages | GatewayIntents.Guilds;

const envSchema = z.object({
  DEBUG: z.any().optional(),
  SLASH_COMMANDS: z
    .any()
    .optional()
    .transform((v) => !!v),

  BOT_TOKEN: z.string().refine((v) => !!BigInt(atob(v.split(".")[0]))),

  REDISHOST: z.string(),
  REDISPORT: z.string().transform(Number),
  REDISUSER: z.string().optional(),
  REDISPASSWORD: z.string().optional(),

  SENDER_URL: z.string(),
  SENDER_AUTH: z.string(),

  GATEWAY_PROXY_URL: z.string().transform((v) => (v.endsWith("/") ? v.slice(0, -1) : v)),
  GATEWAY_PROXY_AUTH: z.string(),

  BOT_URL: z.string(),
  BOT_AUTH: z.string().transform((v) => (v.endsWith("/") ? v.slice(0, -1) : v)),

  REST_PROXY_URL: z.string().transform((v) => (v.endsWith("/") ? v.slice(0, -1) : v)),
  REST_PROXY_AUTH: z.string(),

  DEV_GUILD_ID: z.string().optional(),

  API_BOT_SECRET: z.string(),
  API_BASEURL: z.string(),

  GIFS_VOTE: z.string(),
  GIFS_INVITE: z.string(),
  PHOTOS_THUMBNAIL: z.string(),

  LINKS_BOT_INVITE: z.string(),
  LINKS_SERVER_INVITE: z.string(),
  LINKS_WEBSITE: z.string(),
  LINKS_COMMANDS: z.string(),
  LINKS_BROWSER_REDIRECT: z.string(),
  LINKS_LAUNCHER_REDIRECT: z.string(),

  VOTE_TOPGG: z.string(),
  VOTE_DLISTGG: z.string(),

  NAME_ON_WEBHOOK: z.string(),
  LOGO_URL_ON_WEBHOOK: z.string(),
});

const result = envSchema.safeParse(Deno.env.toObject());

if (!result.success) {
  console.log("❌ Invalid environment variables:", JSON.stringify(result.error.format(), null, 4));

  Deno.exit(1);
}

export const config = {
  ...result.data,
  BOT_ID: BigInt(atob(result.data.BOT_TOKEN.split(".")[0])),
  Intents,
  BASE64_LOGO_ON_WEBHOOK: await getBase64Image(result.data.LOGO_URL_ON_WEBHOOK),
};
