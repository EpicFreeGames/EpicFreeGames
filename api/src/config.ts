import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),

  REDISHOST: z.string(),
  REDISPORT: z.string().transform(Number),

  APP_URL: z.string(),

  APP_SECRET: z.string(),
  BOT_SECRET: z.string(),

  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),

  PORT: z.string().transform(Number),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(env.error.format(), null, 4)
  );
  process.exit(1);
}

export const config = env.data;
