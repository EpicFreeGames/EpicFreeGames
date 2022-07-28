import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),

  ALLOWED_USER_IDS: z.string().transform((value) => value.split(", ")),

  REDISHOST: z.string(),
  REDISPORT: z.string().transform(Number),
  REDISUSER: z.string().optional(),
  REDISPASSWORD: z.string().optional(),

  APP_URL: z.string(),

  APP_SECRET: z.string(),
  BOT_SECRET: z.string(),

  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_API_BASEURL: z.string(),
  DISCORD_REDIRECT_URL: z.string(),

  PORT: z.string().transform(Number),
  ENV: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(env.error.format(), null, 4));
  process.exit(1);
}

export const config = env.data;
