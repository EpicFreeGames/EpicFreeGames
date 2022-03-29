import { WebhookMessageOptions } from "discord.js";
import { config } from "config";
import { executeWebhook } from "./utils";

// prettier-ignore
export const logger = {
  discord: (options: WebhookMessageOptions) => executeWebhook(config.loggingHookUrl, options)
    .catch(() => setTimeout(() => executeWebhook(config.loggingHookUrl, options), 10000)),

  console: (msg: string) => {
    const date = new Date();
    const time = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    const debug = `@ ${time} - `;

    console.log(debug + msg);
  },
  info: (msg: string) => executeWebhook(config.infoHookUrl, { content: msg })
    .catch(() => setTimeout(() => executeWebhook(config.infoHookUrl, { content: msg }), 10000)),
};
