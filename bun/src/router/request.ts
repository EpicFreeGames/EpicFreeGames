import { Method } from "./method";
import { Path, extractUrlData } from "./path";

export async function getRequestData(req: Request) {
	const method = req.method as Method;
	const url = new URL(req.url);
	const urlData = extractUrlData(url);
	const headers = req.headers;
	const textBody = await req.text();
	const body = textBody ? JSON.parse(textBody) : undefined;

	return {
		method,
		path: url.pathname as Path,
		...urlData,
		headers,
		textBody,
		body: body as unknown,
		req,
	};
}

export type RequestData = Awaited<ReturnType<typeof getRequestData>>;
