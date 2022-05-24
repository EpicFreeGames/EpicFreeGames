import toast from "react-hot-toast";

interface Props {
  path: string;
  method: string;
  body?: any;
}

export const request = <T>({ path, method, body }: Props): Promise<T> =>
  fetch(`/api${path}`, {
    method,
    credentials: "same-origin",
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    let json = null;

    try {
      json = await res.json();
    } catch (e) {
      console.error(e);
    }

    if (!res.ok) {
      toast.error(json?.message || "An error occurred");

      throw new Error(json?.message ? json.message : res.statusText);
    }

    if (res.status === 204) return null;

    return json;
  });

export const fetcher = async (url: string) =>
  fetch(`/api${url}`, {
    credentials: "same-origin",
  }).then((res) => res.json());
