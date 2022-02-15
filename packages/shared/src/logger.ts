import { WebhookClient, WebhookMessageOptions } from "discord.js";
import { config } from "config";

const hook = new WebhookClient({
  url: config.loggingHookUrl,
});

interface Logger {
  discord: (options: WebhookMessageOptions) => Promise<any>;
  console: (msg: string) => void;
}

export const logger: Logger = {
  discord: async (options: WebhookMessageOptions) => {
    return hook.send(options);
  },

  console: (msg: string) => {
    const date = new Date();
    const time = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    const debug = `@ ${time} - `;

    console.log(debug + msg);
  },
};
