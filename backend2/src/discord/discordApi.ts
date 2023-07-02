import { ulid } from "ulid";
import { envs } from "../configuration/env";
import { DiscordRequestContext } from "./context";
import { objToStr } from "./utils";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

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
			query?: URLSearchParams;
	  }
	| {
			method: "GET" | "HEAD";
			path: string;
			body?: never;
			query?: URLSearchParams;
	  };

export const discordApi = async <TData>(
	ctx: DiscordRequestContext,
	{ method, path, body, query }: Args
): Promise<ApiResponse<TData>> => {
	const url = `${envs.DC_API_BASE}${path}${query ? `?${query.toString()}` : ""}`;
	const id = ulid();

	ctx.log(`Discord API request`, {
		id,
		method,
		path,
		body,
	});

	return fetch(url, {
		method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bot ${envs.DC_TOKEN}`,
		},
		body: JSON.stringify(body),
	})
		.then(async (res) => {
			const json = await res.json().catch((e) => null);

			if (res.ok) {
				ctx.log("Discord API response", {
					id,
					statusCode: res.status,
				});

				return { data: json };
			} else {
				const error = json ?? {
					statusCode: res.status ?? 500,
					error: res.statusText ?? "Unknown error",
					message: res.statusText ?? "Unknown error",
				};

				let headers: Record<string, unknown> = {};
				res.headers.forEach((value, key) => {
					headers[key] = value;
				});

				ctx.log("Discord API request failed", {
					id,
					statusCode: res.status,
					error,
				});

				return { error };
			}
		})
		.catch((error) => {
			ctx.log("Discord API request failed (catch)", {
				id,
				error,
			});

			return { error };
		});
};
