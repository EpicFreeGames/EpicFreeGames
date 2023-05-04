import { env } from "../configuration/env";
import { Logger } from "../logger";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

type Props =
	| {
			method: Exclude<Method, "GET" | "HEAD">;
			path: string;
			body?: any;
			query?: URLSearchParams;
	  }
	| {
			method: "GET" | "HEAD";
			path: string;
			body?: never;
			query?: URLSearchParams;
	  };

type ApiResponse<TResponseData> =
	| {
			error?: never;
			data: TResponseData;
	  }
	| {
			error: Record<string, unknown>;
			data?: never;
	  };

export async function discordApiRequest<TResponseData = unknown>({
	method,
	path,
	body,
	query,
}: Props): Promise<ApiResponse<TResponseData>> {
	const url = `${env.DC_API_BASE}${path}${query ? `?${query.toString()}` : ""}`;
	const id = Math.random().toString(36).substring(7);

	Logger.debug("Discord API request", { id, method, url, body });

	return fetch(url, {
		method,
		headers: {
			...(body && { "Content-Type": "application/json" }),
			Authorization: `Bot ${env.DC_TOKEN}`,
		},
		...(body && { body: JSON.stringify(body) }),
	})
		.then(async (res) => {
			const json = await res.json().catch((e) => null);

			if (res.ok) {
				Logger.debug("Discord API response", { id, method, url, body, status: res.status });

				return { data: json as TResponseData };
			} else {
				const error = (json as { code: number; message: string }) ?? {
					code: res.status ?? 500,
					message: res.statusText ?? "Unknown error",
				};

				Logger.error("Discord API request failed", {
					id,
					method,
					url,
					body,
					status: res.status,
					error,
					headers: res.headers,
				});

				return { error };
			}
		})
		.catch((error) => {
			Logger.error("Discord API request failed", {
				id,
				method,
				url,
				body,
				error,
			});

			return { error };
		});
}
