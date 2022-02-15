import { AxiosRequestConfig, Method } from "axios";
import { config } from "config";

export const discordApiRequest = (
  url: string,
  method: Method,
  body: any | boolean,
  isJson?: boolean
) => {
  const conf: AxiosRequestConfig = {
    headers: {
      authorization: `Bot ${config.botToken}`,
    },
    method,
    url: `https://discord.com/api/v9${url}`,
  };

  if (isJson) {
    conf.headers!["content-type"] = "application/json";
  }

  if (body) conf.data = body;

  return conf;
};
