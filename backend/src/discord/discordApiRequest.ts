import { env } from "../configuration/env";
import { Ctx } from "../ctx";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

type Props =
	| {
			ctx: Ctx;
			method: Exclude<Method, "GET" | "HEAD">;
			path: string;
			body?: any;
			query?: URLSearchParams;
	  }
	| {
			ctx: Ctx;
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
	ctx,
	method,
	path,
	body,
	query,
}: Props): Promise<ApiResponse<TResponseData>> {
	const url = `${env.DC_API_BASE}${path}${query ? `?${query.toString()}` : ""}`;

	ctx.log("Discord API request", { method, url, body });

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
				ctx.log("Discord API response", { method, url, body, status: res.status });

				return { data: json as TResponseData };
			} else {
				const error = (json as { code: number; message: string }) ?? {
					code: res.status ?? 500,
					message: res.statusText ?? "Unknown error",
				};

				ctx.log("Discord API request failed", {
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
			ctx.log("Discord API request failed", {
				method,
				url,
				body,
				error,
			});

			return { error };
		});
}
