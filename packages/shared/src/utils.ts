import axios, { AxiosRequestConfig, Method } from "axios";
import { config } from "config";
import { WebhookMessageOptions } from "discord.js";

export const discordApiBaseUrl = "https://discord.com/api/v9";

export const isEnum =
  <T>(e: T) =>
  (token: any): token is T[keyof T] =>
    Object.values(e).includes(token as T[keyof T]);

export const discordApiRequest = (url: string, method: Method, body: any = null) => {
  const conf: AxiosRequestConfig = {
    headers: {
      authorization: `Bot ${config.botToken}`,
    },
    method,
    url: `${discordApiBaseUrl}${url}`,
  };

  if (body) {
    conf.headers!["content-type"] = "application/json";
    conf.data = body;
  }

  return conf;
};

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const executeWebhook = (
  webhookUrl: string,
  options: WebhookMessageOptions,
  wait: boolean = false
) => axios.post(`${webhookUrl}${wait ? "?wait=true" : ""}`, options);

export const editWebhookMsg = (msgId: string, webhookUrl: string, options: WebhookMessageOptions) =>
  axios.patch(`${webhookUrl}/messages/${msgId}`, options);

export const deleteWebhookMsg = (msgId: string, webhookUrl: string) =>
  axios.delete(`${webhookUrl}/messages/${msgId}`);
