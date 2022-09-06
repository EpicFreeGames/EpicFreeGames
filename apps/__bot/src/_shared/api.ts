import { sharedConfig } from "./sharedConfig.ts";
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
      // deno-lint-ignore no-explicit-any
      body?: any;
      query?: URLSearchParams;
    }
  | {
      method: "GET" | "HEAD";
      path: string;
      body?: never;
      query?: URLSearchParams;
    };

export const api = <TData>({ method, path, body, query }: Args): Promise<ApiResponse<TData>> =>
  fetch(`${sharedConfig.EFG_API_INTERNAL_BASEURL}${path}${query ? `?${query.toString()}` : ""}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${sharedConfig.EFG_API_BOT_TOKEN}`,
    },
    ...(!!body && { body: JSON.stringify(body) }),
  })
    .then(async (res) => {
      const json = await res.json().catch((e) => null);

      if (res.ok) {
        return { data: json };
      } else {
        const error = json ?? {
          statusCode: res.status ?? 500,
          error: res.statusText ?? "Unknown error",
          message: res.statusText ?? "Unknown error",
        };

        logger.error(
          `API request failed\nRequest url: ${
            sharedConfig.EFG_API_INTERNAL_BASEURL
          }${path}\nError: ${JSON.stringify(error, null, 2)}`
        );

        return { error };
      }
    })
    .catch((error) => {
      logger.error(
        `API request failed\nRequest url: ${
          sharedConfig.EFG_API_INTERNAL_BASEURL
        }${path}\nError: ${JSON.stringify(error, null, 2)}`
      );

      return { error };
    });
