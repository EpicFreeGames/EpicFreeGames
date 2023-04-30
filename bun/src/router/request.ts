import { z } from "zod";
import { Method } from "./method";
import { Path, extractUrlData } from "./path";

export async function getRequestData<
	TBody extends z.ZodType<{}>,
	TPathParams extends z.ZodType<{}>,
	TQueryParams extends z.ZodType<{}>
>(req: Request): Promise<RequestData<TBody, TPathParams, TQueryParams>> {
	const method = req.method as Method;
	const url = new URL(req.url);
	const urlData = extractUrlData(url);
	const headers = req.headers;
	const textBody = await req.text();
	const body = textBody ? JSON.parse(textBody) : undefined;

	return {
		method,
		path: url.pathname as Path,
		pathParams: urlData.pathParams as z.infer<TPathParams>,
		queryParams: urlData.queryParams as z.infer<TQueryParams>,
		headers,
		textBody,
		body: body as z.infer<TBody>,
		req,
	};
}

export type RequestData<
	TBody extends z.ZodType<{}>,
	TPathParams extends z.ZodType<{}>,
	TQueryParams extends z.ZodType<{}>
> = {
	method: Method;
	path: Path;
	pathParams: z.infer<TPathParams>;
	queryParams: z.infer<TQueryParams>;
	headers: Headers;
	textBody: string;
	body: z.infer<TBody>;
	req: Request;
};
