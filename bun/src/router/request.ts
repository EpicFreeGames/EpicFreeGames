import { z } from "zod";
import { Method } from "./method";
import { Path, extractUrlData } from "./path";

export async function getRequestData<
	TBody extends z.ZodTypeAny,
	TPathParams extends z.ZodTypeAny,
	TQueryParams extends z.ZodTypeAny
>(req: Request) {
	const method = req.method as Method;
	const url = new URL(req.url);
	const urlData = extractUrlData<TPathParams, TQueryParams>(url);
	const headers = req.headers;
	const textBody = await req.text();
	const body = textBody ? JSON.parse(textBody) : undefined;

	return {
		method,
		path: url.pathname as Path,
		...urlData,
		headers,
		textBody,
		body: body as TBody,
		req,
	};
}

export type RequestData<
	TBody extends z.ZodTypeAny,
	TPathParams extends z.ZodTypeAny,
	TQueryParams extends z.ZodTypeAny
> = Awaited<ReturnType<typeof getRequestData<TBody, TPathParams, TQueryParams>>>;
