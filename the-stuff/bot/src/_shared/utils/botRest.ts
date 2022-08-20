import { createRestManager } from "discordeno";

import { sharedConfig } from "../sharedConfig.ts";

export const botRest = createRestManager({
  token: sharedConfig.BOT_TOKEN,
  secretKey: sharedConfig.REST_PROXY_AUTH,
  customUrl: sharedConfig.REST_PROXY_URL,
});
