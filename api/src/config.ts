import { createSecretKey } from "crypto";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),

  ALLOWED_USER_IDS: z.string().transform((value) => value.split(", ")),

  DASH_URL: z.string(),

  REDISHOST: z.string(),
  REDISPORT: z.string().transform(Number),
  REDISUSER: z.string().optional(),
  REDISPASS: z.string().optional(),

  EFG_API_SECRET: z.string(),
  EFG_API_BOT_SECRET: z.string(),

  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_API_BASEURL: z.string(),
  DISCORD_REDIRECT_URL: z.string(),

  SENDER_URL: z.string(),
  SENDER_AUTH: z.string(),

  JWT_ACC_ISS: z.string(),
  JWT_ACC_AUD: z.string(),
  JWT_ACC_EXP: z.string(),
  JWT_ACC_SECRET: z.string(),

  JWT_REF_ISS: z.string(),
  JWT_REF_AUD: z.string(),
  JWT_REF_EXP: z.string(),
  JWT_REF_SECRET: z.string(),

  PORT: z.string().transform(Number),
  ENV: z.enum(["Development", "Staging", "Production"]),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(env.error.format(), null, 4));
  process.exit(1);
}

export const config = {
  ...env.data,
  JWT_ACC_KEY: createSecretKey(env.data.JWT_ACC_SECRET, "utf-8"),
  JWT_REF_KEY: createSecretKey(env.data.JWT_REF_SECRET, "utf-8"),
};
