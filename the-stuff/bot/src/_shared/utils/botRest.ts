import { createRestManager } from "discordeno";
import { config } from "~config";

export const botRest = createRestManager({
  token: config.BOT_TOKEN,
  secretKey: config.REST_PROXY_AUTH,
  customUrl: config.REST_PROXY_URL,
});
