import { configuration } from "@efg/configuration";

import { objToStr } from "../jsonStringify";

export type Method = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH";

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
      body?: any;
    }
  | {
      method: "GET" | "HEAD";
      path: string;
      body?: never;
    };

export const efgApi = async <TData>({ method, path, body }: Args): Promise<ApiResponse<TData>> => {
  const url = `${configuration.EFG_API_BASEURL}${path}`;

  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${configuration.VALID_BOT_TOKEN}`,
    },
    body: JSON.stringify(body),
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

        console.error(
          [
            "Efg API request failed",
            `Request url: ${url}`,
            `Error: ${objToStr(error)}`,
            `Body used: ${objToStr(body)}`,
          ].join("\n")
        );

        return { error };
      }
    })
    .catch((error) => {
      console.error(
        [
          "Efg API request failed",
          `Request url: ${url}`,
          `Error: ${objToStr(error)}`,
          `Body used: ${objToStr(body)}`,
        ].join("\n")
      );

      return { error };
    });
};
