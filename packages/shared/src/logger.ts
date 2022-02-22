import { WebhookMessageOptions } from "discord.js";
import { config } from "config";
import { executeWebhook } from "./utils";

export const logger = {
  discord: (options: WebhookMessageOptions) => executeWebhook(config.loggingHookUrl, options),
  console: (msg: string) => {
    const date = new Date();
    const time = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    const debug = `@ ${time} - `;

    console.log(debug + msg);
  },
};
