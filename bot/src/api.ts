import { serialize } from "~json/initiator.ts";
import { config } from "./config.ts";
import { Method } from "./types.ts";
import { logger } from "./utils/logger.ts";

type ApiResponse<TData> =
  | {
      error?: never;
      data: TData;
    }
  | {
      error: Record<string, unknown>;
      data?: never;
    };

type Args =
  | {
      method: Exclude<Method, "GET" | "HEAD">;
      path: string;
      body?: Record<string, string | number | null | undefined>;
    }
  | {
      method: "GET" | "HEAD";
      path: string;
      body?: never;
    };

export async function api<TData>({
  method,
  path,
  body,
}: Args): Promise<ApiResponse<TData>> {
  return fetch(`${config.API_BASEURL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${config.API_BOT_SECRET}`,
    },
    ...(!!body && { body: await serialize(body) }),
  })
    .then(async (res) => {
      const json = await res.json();

      if (res.ok) {
        return {
          data: json,
        };
      } else {
        throw json;
      }
    })
    .catch(async (err) => {
      logger.error(
        `API request failed\nRequest url: ${
          config.API_BASEURL
        }${path}\nError: ${await serialize(err)}`
      );

      return {
        error: err,
      };
    });
}
