import { serialize } from "./bot/utils/jsonWorker/initiator.ts";
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

export const api = async <TData>(
  method: Method,
  path: string,
  data?: Record<string, string | number | null | undefined>
): Promise<ApiResponse<TData>> =>
  fetch(`${config.API_BASEURL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${config.API_TOKEN}`,
    },
    body: await serialize(data ? data : {}),
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
    .catch((err) => {
      logger.error(
        `API request failed\nRequest url: ${config.API_BASEURL}${path}\nError: ${err}`
      );

      return {
        error: err,
      };
    });
