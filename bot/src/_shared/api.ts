import { config } from "~config";
import { Method } from "./types.ts";
import { serialize } from "./utils/jsonWorker/initiator.ts";
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
      body?: Record<string, string | number | boolean | null | undefined>;
    }
  | {
      method: "GET" | "HEAD";
      path: string;
      body?: never;
    };

export async function api<TData>({ method, path, body }: Args): Promise<ApiResponse<TData>> {
  return fetch(`${config.EFG_API_BASEURL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${config.EFG_API_BOT_SECRET}`,
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
          config.EFG_API_BASEURL
        }${path}\nError: ${await serialize(err)}`
      );

      return {
        error: err,
      };
    });
}
