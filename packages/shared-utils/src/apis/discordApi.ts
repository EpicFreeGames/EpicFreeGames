import { configuration } from "@efg/configuration";
import { logger } from "@efg/logger";

import { objToStr } from "../objToStr";
import { ApiResponse, Method } from "./shared";

type Args =
  | {
      method: Exclude<Method, "GET" | "HEAD">;
      path: string;
      body?: any;
    }
  | {
      method: "GET" | "HEAD";
      path: string;
      body?: never;
    };

export const discordApi = async <TData>(
  { method, path, body }: Args,
  { useProxy } = { useProxy: true }
): Promise<ApiResponse<TData>> => {
  const url = `${
    useProxy ? configuration.EFG_DISCORD_REST_PROXY_BASEURL : configuration.DISCORD_API_BASEURL
  }${path}`;

  logger.debug(`Discord API request: ${method} ${url} ${objToStr(body)}`);

  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(!useProxy && { Authorization: `Bot ${configuration.DISCORD_BOT_TOKEN}` }),
    },
    body: JSON.stringify(body),
  })
    .then(async (res) => {
      const json = await res.json().catch((e) => null);

      if (res.ok) {
        logger.debug(`Discord API response: ${method} ${url} ${res.status}`);
        return { data: json };
      } else {
        const error = json ?? {
          statusCode: res.status ?? 500,
          error: res.statusText ?? "Unknown error",
          message: res.statusText ?? "Unknown error",
        };

        logger.debug(
          [
            "Discord API request failed",
            `Request url: ${url}`,
            `Error: ${objToStr(error)}`,
            `Body used: ${objToStr(body)}`,
          ].join("\n")
        );

        return { error };
      }
    })
    .catch((error) => {
      logger.debug(
        [
          "Discord API request failed",
          `Request url: ${url}`,
          `Error: ${objToStr(error)}`,
          `Body used: ${objToStr(body)}`,
        ].join("\n")
      );

      return { error };
    });
};