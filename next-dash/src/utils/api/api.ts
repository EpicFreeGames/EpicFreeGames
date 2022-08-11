import { efgApiBaseUrl } from "~utils/envs";

export const apiRequest = <TData>(path: string, method: string, body?: any) =>
  fetch(`${efgApiBaseUrl}${path}`, {
    method,
    credentials: "include",
    ...(body
      ? {
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }
      : {}),
  }).then(async (r) => {
    const json = await r.json().catch((e) => null);

    if (r.ok) {
      return json as TData;
    } else {
      const errorStuff = json ?? {
        statusCode: r.status ?? 500,
        error: r.statusText ?? "Unknown error",
        message: r.statusText ?? "Unknown error",
      };

      throw new Error(errorStuff);
    }
  });

export type ApiError = {
  statusCode: number;
  error: string;
  message: string;
};
