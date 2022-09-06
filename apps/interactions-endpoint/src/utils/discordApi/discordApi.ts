import { configuration } from "@efg/configuration";

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
      // deno-lint-ignore no-explicit-any
      body?: any;
    }
  | {
      method: "GET" | "HEAD";
      path: string;
      body?: never;
    };

export const discordApi = async <TData>({
  method,
  path,
  body,
}: Args): Promise<ApiResponse<TData>> => {
  const url = `${configuration.DISCORD_API_BASEURL}${path}`;

  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${configuration.DISCORD_BOT_TOKEN}`,
    },
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
          `API request failed\nRequest url: ${url}\nError: ${JSON.stringify(error, null, 2)}`
        );

        return { error };
      }
    })
    .catch((error) => {
      console.error(
        `API request failed\nRequest url: ${path}}\nError: ${JSON.stringify(error, null, 2)}`
      );

      return { error };
    });
};
