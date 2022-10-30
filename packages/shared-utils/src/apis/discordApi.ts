import { configuration } from "@efg/configuration";
import { logger } from "@efg/logger";

import { objToStr } from "../objToStr";
import { ApiResponse, Method } from "./shared";

type Args =
  | {
      method: Exclude<Method, "GET" | "HEAD">;
      path: string;
      body?: any;
      query?: URLSearchParams;
    }
  | {
      method: "GET" | "HEAD";
      path: string;
      body?: never;
      query?: URLSearchParams;
    };

export const discordApi = async <TData>(
  { method, path, body, query }: Args,
  { useProxy } = { useProxy: true }
): Promise<ApiResponse<TData>> => {
  const url = `${
    useProxy ? configuration.EFG_DISCORD_REST_PROXY_BASEURL : configuration.DISCORD_API_BASEURL
  }${path}${query ? `?${query.toString()}` : ""}`;

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
        logger.debug(`Discord API response: ${method} ${url} (status ${res.status})`);
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
            `Error: ${JSON.stringify(error)}`,
            `Body used: ${JSON.stringify(body)}`,
            `Details?: ${JSON.stringify({
              "res.status": res.status,
              "res.headers": JSON.stringify(res.headers.forEach((v, k) => ({ [k]: v }))),
              "res.data": json,
            })}`,
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
          `Body used: ${JSON.stringify(body)}`,
        ].join("\n")
      );

      return { error };
    });
};
