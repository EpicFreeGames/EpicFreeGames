import { ulid } from "ulid";
import { envs } from "../configuration/env";
import { DiscordRequestContext } from "./context";

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
		token: envs.DC_TOKEN,
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
				ctx.log("Discord API request failed", {
					id,
					statusCode: res.status,
					json,
				});

				return { error: json };
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
