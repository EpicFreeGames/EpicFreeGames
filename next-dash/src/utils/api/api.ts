import toast from "react-hot-toast";
import { isBrowser } from "~hooks/useIsBrowser";
import { envs } from "~utils/envs";

export const apiRequest = <TData = any>(path: string, method: string, body?: any) =>
  fetch(`${envs.efgApiBaseUrl}${path}`, {
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
      const error = json ?? {
        statusCode: r.status ?? 500,
        error: r.statusText ?? "Unknown error",
        message: r.statusText ?? "Unknown error",
      };

      if (isBrowser) {
        if (error.statusCode === 401) window.location.href = "/login";
        if (error.statusCode === 403) history.back();
      }

      toast.error(error.message);

      throw new Error(error.message);
    }
  });

export type ApiError = {
  statusCode: number;
  error: string;
  message: string;
};
