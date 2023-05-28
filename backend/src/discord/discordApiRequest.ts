import { env } from "../configuration/env";
import { Ctx } from "../ctx";
import { ulid } from "ulid";

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

export async function discordApiRequest<TResponseData = unknown>(
	props: Props
): Promise<ApiResponse<TResponseData>> {
	const url = `${env.DC_API_BASE}${props.path}${props.query ? `?${props.query.toString()}` : ""}`;
	const id = ulid();

	props.ctx.log("Discord API request", {
		id,
		m: props.method,
		u: url,
		b: props.body,
		q: props.query,
	});

	return fetch(url, {
		method: props.method,
		headers: {
			...(props.body && { "Content-Type": "application/json" }),
		},
		...(props.body && { body: JSON.stringify(props.body) }),
	})
		.then(async (res) => {
			const json = await res.json().catch((e) => null);

			if (res.ok) {
				props.ctx.log("Discord API response", {
					id,
					url,
					s: res.status,
				});

				return { data: json as TResponseData };
			} else {
				const error = (json as { code: number; message: string }) ?? {
					code: res.status ?? 500,
					message: res.statusText ?? "Unknown error",
				};

				props.ctx.log("Discord API response", {
					id,
					url,
					s: res.status,
					j: json,
				});

				return { error };
			}
		})
		.catch((error) => {
			props.ctx.log("Discord API request failed", {
				id,
				url,
				e: error,
			});

			return { error };
		});
}
