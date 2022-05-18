import { config } from "config";

interface Props {
  path: string;
  method: string;
  body?: any;
}

export const request = <T>({ path, method, body }: Props): Promise<T> =>
  fetch(`${config.webUi.apiUrl}${path}`, {
    method,
    credentials: "same-origin",
    body: JSON.stringify(body),
  }).then((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  });

export const fetcher = async (url: string) =>
  fetch(`${config.webUi.apiUrl}${url}`, {
    credentials: "same-origin",
  }).then((res) => res.json());
