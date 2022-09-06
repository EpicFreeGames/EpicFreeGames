import { z } from "zod";

import { getBase64Image } from "./getBase64Image";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  ADMIN_DISCORD_ID: z.string().optional(),

  REDISHOST: z.string(),
  REDISPORT: z.string().transform(Number),
  REDISUSER: z.string().optional(),
  REDISPASS: z.string().optional(),

  DISCORD_BOT_TOKEN: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_PUBLIC_KEY: z.string(),
  DISCORD_API_BASEURL: z.string(),
  DISCORD_REDIRECT_URL: z.string(),

  SENDER_URL: z.string(),
  DASH_URL: z.string(),

  JWT_ISS: z.string(),
  JWT_AUD: z.string(),

  SECRET: z.string(),

  VALID_BOT_TOKEN: z.string(),
  VALID_FRONT_TOKEN: z.string(),
  VALID_SCRAPER_TOKEN: z.string(),
  VALID_HEALTHCHECK_TOKEN: z.string(),

  EFG_API_BASEURL: z.string(),
  EFG_API_WS_URL: z.string(),
  EFG_FRONT_BASEURL: z.string(),

  LOGO_URL: z.string(),

  ENV: z.enum(["Development", "Staging", "Production"]),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(env.error.format(), null, 4));
  process.exit(1);
}

const botId = BigInt(
  Buffer.from(env.data.DISCORD_BOT_TOKEN.split(".")?.at(0) ?? "").toString("base64")
);
const base64Logo = `data:image/png;base64,${await getBase64Image(env.data.LOGO_URL)}`;

const env2Schema = z.object({
  DISCORD_BOT_ID: z.string().transform(BigInt),
  BASE64_LOGO: z.string(),
});

const env2 = env2Schema.safeParse({
  DISCORD_BOT_ID: botId,
  BASE64_LOGO: base64Logo,
});

if (!env2.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(env2.error.format(), null, 4));
  process.exit(1);
}

export const configuration = {
  ...env.data,
  ...env2.data,
  JWT_KEY: new TextEncoder().encode(env.data.SECRET),
};

export * from "./botConstants";
