import { sharedConfig } from "./sharedConfig.ts";
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
      query?: URLSearchParams;
    }
  | {
      method: "GET" | "HEAD";
      path: string;
      body?: never;
      query?: URLSearchParams;
    };

export async function api<TData>({ method, path, body, query }: Args): Promise<ApiResponse<TData>> {
  return fetch(
    `${sharedConfig.EFG_API_INTERNAL_BASEURL}${path}${query ? `?${query.toString()}` : ""}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${sharedConfig.EFG_API_BOT_SECRET}`,
      },
      ...(!!body && { body: await serialize(body) }),
    }
  )
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
          sharedConfig.EFG_API_INTERNAL_BASEURL
        }${path}\nError: ${await serialize(err)}`
      );

      return {
        error: err,
      };
    });
}
