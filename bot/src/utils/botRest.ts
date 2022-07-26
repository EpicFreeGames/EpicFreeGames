import { createRestManager } from "https://deno.land/x/discordeno@13.0.0-rc45/mod.ts";
import { config } from "../config.ts";

export const botRest = createRestManager({
  token: config.BOT_TOKEN,
  secretKey: config.REST_PROXY_AUTH,
  customUrl: config.REST_PROXY_URL,
});
