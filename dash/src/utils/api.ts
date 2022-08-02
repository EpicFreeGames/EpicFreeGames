import { config } from "~config";

export type Method = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH";
export type RestMethod = Exclude<Method, "HEAD">;

type ApiResponse<TData> =
  | {
      error?: never;
      data: TData;
      response: Response;
    }
  | {
      error: Response;
      data?: never;
      response?: never;
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
      if (res.ok) {
        if (res.status !== 204) {
          const json = await res.json();

          return {
            data: json,
            response: res,
          };
        }

        return {
          data: undefined,
          response: res,
        };
      } else {
        const json = await res.json().catch(() => null);
        console.error(json || "unknown error");

        const errorStuff = new URLSearchParams();

        errorStuff.append("statusCode", String(res.status || 500));
        errorStuff.append("error", json?.error || "unknown error");
        errorStuff.append("message", json?.message || "unknown error");

        console.error(
          `API request failed\nRequest url: ${config.API_BASEURL}${path}\nError: ${JSON.stringify(
            json,
            null,
            2
          )}`
        );

        if (res.status === 401)
          return {
            error: new Response(null, {
              status: 303,
              headers: {
                Location: "/login",
              },
            }),
          };

        return {
          error: new Response(null, {
            status: 303,
            headers: {
              Location: `/error?${errorStuff.toString()}`,
            },
          }),
        };
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

      const errorStuff = new URLSearchParams();

      errorStuff.append("statusCode", String(err?.status || 500));
      errorStuff.append("error", err?.message || "unknown error");
      errorStuff.append("message", err?.message || "unknown error");

      return {
        error: new Response(null, {
          status: 303,
          headers: {
            Location: `/error?${errorStuff.toString()}`,
          },
        }),
      };
    });
}
