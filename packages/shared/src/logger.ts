import { WebhookMessageOptions } from "discord.js";
import { config } from "config";
import { executeWebhook } from "./utils";

interface Logger {
  discord: (options: WebhookMessageOptions) => Promise<any>;
  console: (msg: string) => void;
}

export const logger: Logger = {
  discord: async (options: WebhookMessageOptions) => executeWebhook(config.loggingHookUrl, options),
  console: (msg: string) => {
    const date = new Date();
    const time = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    const debug = `@ ${time} - `;

    console.log(debug + msg);
  },
};
