import { WebhookClient, WebhookMessageOptions } from "discord.js";
import { config } from "config";

const hook = new WebhookClient({
  url: config.loggingHookUrl,
});

export const logger: any = {
  discord: async (options: WebhookMessageOptions) => {
    return await hook.send(options);
  },

  console: (msg: string) => {
    const date = new Date();
    const time = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    const debug = `@ ${time} - `;

    console.log(debug + msg);
  },
};
