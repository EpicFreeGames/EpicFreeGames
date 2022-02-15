import { AxiosRequestConfig, Method } from "axios";
import { config } from "config";

export const discordApiRequest = (url: string, method: Method, body: any = null) => {
  const conf: AxiosRequestConfig = {
    headers: {
      authorization: `Bot ${config.botToken}`,
    },
    method,
    url: `https://discord.com/api/v9${url}`,
  };

  if (body) {
    conf.headers!["content-type"] = "application/json";
    conf.data = body;
  }

  return conf;
};
