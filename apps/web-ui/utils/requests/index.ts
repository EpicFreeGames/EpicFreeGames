import { apiBaseUrl } from "../envs";

interface Props {
  path: string;
  method: string;
  body?: any;
}

export const request = <T>({ path, method, body }: Props): Promise<T> =>
  fetch(`${apiBaseUrl}${path}`, {
    method,
    credentials: "same-origin",
    body: body ? JSON.stringify(body) : undefined,
  }).then((res) => {
    if (!res.ok) throw new Error(res.statusText);

    if (res.status === 204) return null;

    return res.json();
  });

export const fetcher = async (url: string) =>
  fetch(`${apiBaseUrl}${url}`, {
    credentials: "same-origin",
  }).then((res) => res.json());
