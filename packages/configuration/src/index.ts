import * as dotenv from "dotenv";
import { join } from "path";
import { z } from "zod";

dotenv.config({ debug: true, path: join(__dirname, "..", "./.env") });

const envSchema = z.object({
  DATABASE_URL: z.string(),
  ADMIN_DISCORD_ID: z.string().optional(),

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
  Buffer.from(env.data.DISCORD_BOT_TOKEN.split(".")?.at(0) ?? "", "base64").toString("utf-8")
);

const env2 = z
  .object({
    DISCORD_BOT_ID: z.bigint(),
  })
  .safeParse({
    DISCORD_BOT_ID: botId,
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
