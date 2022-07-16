import { z } from "zod";
import dotenv from "dotenv";
import { createSecretKey } from "crypto";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  APP_URL: z.string(),

  APP_SECRET: z.string(),
  BOT_SECRET: z.string(),

  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_API_BASEURL: z.string(),

  JWT_ACC_SECRET: z.string(),
  JWT_ACC_AUD: z.string(),
  JWT_ACC_ISS: z.string(),
  JWT_ACC_EXP: z.string(),

  JWT_REF_SECRET: z.string(),
  JWT_REF_AUD: z.string(),
  JWT_REF_ISS: z.string(),
  JWT_REF_EXP: z.string(),

  PORT: z.string().transform(Number),

  MAIL_HOST: z.string(),
  MAIL_PORT: z.string().transform(Number),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  MAIL_FROM: z.string(),
});

const env = envSchema.safeParse(
  process.env.NODE_ENV === "development" ? dotenv.config().parsed : process.env
);

if (!env.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(env.error.format(), null, 4)
  );
  process.exit(1);
}

export const config = {
  ...env.data,
  JWT_ACC_KEY: createSecretKey(env.data.JWT_ACC_SECRET, "utf-8"),
  JWT_REF_KEY: createSecretKey(env.data.JWT_REF_SECRET, "utf-8"),
};
