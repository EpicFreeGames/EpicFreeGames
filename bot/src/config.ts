import { GatewayIntents } from "discordeno";
import { z } from "zod";
import { getBase64Image } from "~shared/utils/getBase64Image.ts";
import { botConstants } from "./_shared/constants.ts";

const Intents: GatewayIntents = GatewayIntents.DirectMessages | GatewayIntents.Guilds;

const envSchema = z.object({
  DEBUG: z.any().optional(),
  SLASH_COMMANDS: z
    .any()
    .optional()
    .transform((v) => !!v),

  BOT_TOKEN: z.string().refine((v) => !!BigInt(atob(v.split(".")?.at(0) ?? ""))),

  REDISHOST: z.string(),
  REDISPORT: z.string().transform(Number),
  REDISUSER: z.string().optional(),
  REDISPASSWORD: z.string().optional(),

  SENDER_URL: z.string(),
  SENDER_AUTH: z.string(),

  BOT_URL: z.string(),
  BOT_AUTH: z.string().transform((v) => (v.endsWith("/") ? v.slice(0, -1) : v)),

  REST_PROXY_URL: z.string().transform((v) => (v.endsWith("/") ? v.slice(0, -1) : v)),
  REST_PROXY_AUTH: z.string(),

  DEV_GUILD_ID: z.string().optional(),

  EFG_API_BOT_SECRET: z.string(),
  EFG_API_BASEURL: z.string(),
  DISCORD_API_BASEURL: z.string(),

  ENV: z.enum(["Development", "Staging", "Production"]),
});

const result = envSchema.safeParse(Deno.env.toObject());

if (!result.success) {
  console.log("❌ Invalid environment variables:", JSON.stringify(result.error.format(), null, 4));

  Deno.exit(1);
}

const botId = BigInt(atob(result.data.BOT_TOKEN.split(".")?.at(0) ?? ""));
const base64Logo = `data:image/png;base64,${await getBase64Image(
  botConstants.botLogoUrl(result.data.ENV)
)}`;

const env2Schema = envSchema.and(
  z.object({
    BOT_ID: z.bigint(),
    BASE64_LOGO: z.string(),
  })
);

const result2 = env2Schema.safeParse({ ...result.data, botId, base64Logo });

if (!result2.success) {
  console.log(
    "❌ Invalid environment variables (schema2):",
    JSON.stringify(result2.error.format(), null, 4)
  );

  Deno.exit(1);
}

export const config = {
  ...result.data,
  ...result2.data,
  Intents,
};
