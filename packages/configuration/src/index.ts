import { z } from "zod";

import { botLogos } from "./botLogos";

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

  EFG_API_BASEURL: z.string(),
  EFG_API_WS_URL: z.string(),
  EFG_FRONT_BASEURL: z.string(),
  EFG_DISCORD_REST_PROXY_BASEURL: z.string(),

  LOGO_URL: z.string(),

  ENV: z.enum(["Development", "Staging", "Production"]),
  DEBUG: z.any().transform((v) => !!v),

  VERSION: z.string(),
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

export const botConstants = {
  inviteGif:
    "https://media1.tenor.com/images/8be041fe538a0f292bb85885768341a7/tenor.gif?itemid=5261112",

  browserRedirect: (path: string) => `${configuration.EFG_FRONT_BASEURL}/r/browser${path}`,
  launcherRedirect: (path: string) => `${configuration.EFG_FRONT_BASEURL}/r/launcher${path}`,

  website: {
    home: `${configuration.EFG_FRONT_BASEURL}`,
    commands: `${configuration.EFG_FRONT_BASEURL}/commands`,
    tutorial: `${configuration.EFG_FRONT_BASEURL}/tutorial`,
    serverInvite: `https://discord.gg/49UQcJe`,
    botInvite: `${configuration.EFG_FRONT_BASEURL}/invite`,
  },

  voteLinks: {
    "Top.gg": "https://top.gg/bot/719806770133991434/vote",
    "Discordlist.gg": "https://discordlist.gg/bot/719806770133991434/vote",
  },

  botName: "EpicFreeGames",
  webhookName:
    configuration.ENV === "Production"
      ? "EpicFreeGames Notifications"
      : `${configuration.ENV} EpicFreeGames Notifications`,
  base64Logo: botLogos[configuration.ENV],
};
