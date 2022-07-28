import { config } from "~config";

export type Method = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH";
export type RestMethod = Exclude<Method, "HEAD">;

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
      auth?: string;
      body?: Record<string, string | number | boolean | null | undefined> | string;
    }
  | {
      method: "GET" | "HEAD";
      path: string;
      auth?: string;
      body?: never;
    };

export function api<TData>({ method, path, body, auth }: Args): Promise<ApiResponse<TData>> {
  return fetch(`${config.API_BASEURL}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Cookie: `sid=${auth}` } : {}),
    },
    ...(!!body && { body: typeof body === "string" ? body : JSON.stringify(body) }),
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
      console.error(
        `API request failed\nRequest url: ${config.API_BASEURL}${path}\nError: ${JSON.stringify(
          err,
          null,
          2
        )}`
      );

      return {
        error: err,
      };
    });
}
