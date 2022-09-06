import { GatewayIntents } from "discordeno";
import { z } from "zod";

import { getBase64Image } from "~shared/utils/getBase64Image.ts";

const envSchema = z.object({
  EFG_API_INTERNAL_BASEURL: z.string(),
  EFG_API_BOT_TOKEN: z.string(),

  EFG_FRONT_BASEURL: z.string(),

  REDISHOST: z.string(),
  REDISPORT: z.string().transform(Number),
  REDISUSER: z.string().optional(),
  REDISPASS: z.string().optional(),

  BOT_TOKEN: z.string().refine((v) => !!BigInt(atob(v.split(".")?.at(0) ?? ""))),
  REST_PROXY_URL: z.string().transform((v) => (v.endsWith("/") ? v.slice(0, -1) : v)),

  DEBUG: z.any().optional(),
  DISCORD_API_BASEURL: z.string(),
  LOGO_URL: z.string(),
});

const result = envSchema.safeParse(Deno.env.toObject());

if (!result.success) {
  console.log(
    "❌ (_shared) Invalid environment variables:",
    JSON.stringify(result.error.format(), null, 2)
  );

  Deno.exit(1);
}

const botId = BigInt(atob(result.data.BOT_TOKEN.split(".")?.at(0) ?? ""));
const base64Logo = `data:image/png;base64,${await getBase64Image(result.data.LOGO_URL)}`;

const env2Schema = z.object({
  BOT_ID: z.bigint(),
  BASE64_LOGO: z.string(),
  INTENTS: z.number().transform((v) => v as GatewayIntents),
});

const result2 = env2Schema.safeParse({
  BOT_ID: botId,
  BASE64_LOGO: base64Logo,
  INTENTS: GatewayIntents.DirectMessages | GatewayIntents.Guilds,
});

if (!result2.success) {
  console.log(
    "❌ (_shared) Invalid environment variables (schema2):",
    JSON.stringify(result2.error.format(), null, 2)
  );

  Deno.exit(1);
}

export const sharedConfig = {
  ...result.data,
  ...result2.data,
};
