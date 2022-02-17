import { AxiosRequestConfig, Method } from "axios";
import { config } from "config";

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
