import { createRestManager } from "discordeno";

import { sharedConfig } from "../sharedConfig.ts";

export const botRest = createRestManager({
  token: sharedConfig.BOT_TOKEN,
  customUrl: sharedConfig.REST_PROXY_URL,
});
