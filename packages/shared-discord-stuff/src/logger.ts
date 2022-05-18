import { config } from "config";
import { executeWebhook, WebhookMessageOptions } from "./utils";

// prettier-ignore
export const logger = {
  discord: (options: WebhookMessageOptions) => executeWebhook({ webhookUrl: config.loggingHookUrl, options})
    .catch(() => setTimeout(() => executeWebhook({ webhookUrl: config.loggingHookUrl, options}), 10000)),

  console: (msg: string) => {
    const date = new Date();
    const time = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
    const debug = `@ ${time} - `;

    console.log(debug + msg);
  },
  info: (msg: string) => executeWebhook({ webhookUrl: config.infoHookUrl, options: { content: msg } })
    .catch(() => setTimeout(() => executeWebhook({ webhookUrl: config.infoHookUrl, options: { content: msg } }), 10000)),
};
