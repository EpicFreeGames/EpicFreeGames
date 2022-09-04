import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  ADMIN_DISCORD_ID: z.string().optional(),

  REDISHOST: z.string(),
  REDISPORT: z.string().transform(Number),
  REDISUSER: z.string().optional(),
  REDISPASS: z.string().optional(),

  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
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

  ENV: z.enum(["Development", "Staging", "Production"]),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(env.error.format(), null, 4));
  process.exit(1);
}

export const config = {
  ...env.data,
  JWT_KEY: new TextEncoder().encode(env.data.SECRET),
};
