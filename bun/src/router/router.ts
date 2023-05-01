import { z } from "zod";
import { Logger } from "../logger";
import { createResponse } from "../utils";

function matchPaths(left: string, right: string) {
	if (left === right) {
		return true;
	} else if (left === "/") {
		return true;
	} else if (right === "/") {
		return true;
	} else if (right.startsWith(left)) {
		return true;
	} else if (left.startsWith(right)) {
		return true;
	}

	const leftParts = left.split("/");
	const rightParts = right.split("/");
	if (leftParts.length !== rightParts.length) {
		return false;
	}

	for (let i = 0; i < leftParts.length; i++) {
		const leftPart = leftParts[i];
		const rightPart = rightParts[i];
		if (leftPart?.startsWith(":")) {
			continue;
		}
		if (leftPart !== rightPart) {
			return false;
		}
	}
	return true;
}

export class Root {
	private _handlers: Handler[] = [];

	async handle(req: Request) {
		const reqUrl = new URL(req.url);
		const initialInfo = {
			path: reqUrl.pathname,
		};

		Logger.debug("Finding handler for", { initialInfo });

		const handler = this._handlers.find((handler) => {
			Logger.debug("Checking handler", {
				req,
				handler,
			});
			return handler.method === req.method && matchPaths(handler.path, reqUrl.pathname);
		});

		if (!handler) {
			Logger.debug("No handler found", { initialInfo });
			return createResponse(404, { error: "Endpoint does not exist" });
		}

		Logger.debug("Handler found", { initialInfo, handler });

		const bodyRes = await getBody(req);

		if (!bodyRes.success) {
			return createResponse(400, { error: "Invalid request body" });
		}

		const requestData: RequestData = {
			...initialInfo,
			pathParams: getPathParams(reqUrl.pathname, handler.path),
			queryParams: Object.fromEntries(reqUrl.searchParams.entries()),
			body: bodyRes.jsonBody,
			textBody: bodyRes.textBody,
			originalRequest: req,
		};

		Logger.debug("Calling handler", { handler, requestData });

		const response = await handler.handle(requestData);

		return response || createResponse(204);
	}

	use(path: string, router: Router) {
		Logger.debug(`Setting up router at ${path} with ${router.handlers.length} handlers`);

		this._handlers.push(
			...router.handlers.map((handler) => ({
				...handler,
				path: path + handler.path,
			}))
		);

		router.purge();
	}
}

export class Router {
	private _handlers: Handler[] = [];

	get handlers() {
		return this._handlers;
	}

	purge() {
		this._handlers = [];
	}

	use(path: string, router: Router) {
		Logger.debug(`Setting up router at ${path} with ${router.handlers.length} handlers`);

		this._handlers.push(
			...router.handlers.map((handler) => ({
				...handler,
				path: path + handler.path,
			}))
		);

		return this;
	}

	get(path: string, handle: Handler["handle"]) {
		this._handlers.push({
			path,
			method: "GET",
			handle,
		});

		return this;
	}

	getWithValidation<
		TBody extends z.ZodType<{}>,
		TPathParams extends z.ZodType<{}>,
		TQueryParams extends z.ZodType<{}>
	>(
		path: string,
		validation: {
			pathParams?: TPathParams;
			queryParams?: TQueryParams;
		},
		handle: Handler<z.infer<TBody>, z.infer<TPathParams>, z.infer<TQueryParams>>["handle"]
	) {
		this._handlers.push({
			path,
			method: "GET",
			handle: async (req) => {
				const validationRes = await handleWithValidation<TBody, TPathParams, TQueryParams>({
					request: req,
					validation,
				});

				if (!validationRes.valid) {
					return createResponse(400, {
						error: "Invalid request",
						details: validationRes.errors,
					});
				}

				return handle(validationRes.validRequestData);
			},
		});

		return this;
	}

	post(path: string, handle: Handler["handle"]) {
		this._handlers.push({
			path,
			method: "POST",
			handle,
		});

		return this;
	}

	postWithValidation<
		TBody extends z.ZodType<{}>,
		TPathParams extends z.ZodType<{}>,
		TQueryParams extends z.ZodType<{}>
	>(
		path: string,
		validation: {
			body?: TBody;
			pathParams?: TPathParams;
			queryParams?: TQueryParams;
		},
		handle: Handler<z.infer<TBody>, z.infer<TPathParams>, z.infer<TQueryParams>>["handle"]
	) {
		this._handlers.push({
			path,
			method: "POST",
			handle: async (req) => {
				const validationRes = await handleWithValidation<TBody, TPathParams, TQueryParams>({
					request: req,
					validation,
				});

				if (!validationRes.valid) {
					return createResponse(400, {
						error: "Invalid request",
						details: validationRes.errors,
					});
				}

				return handle(validationRes.validRequestData);
			},
		});

		return this;
	}
}

async function handleWithValidation<
	TBody extends z.ZodTypeAny,
	TPathParams extends z.ZodTypeAny,
	TQueryParams extends z.ZodTypeAny
>(props: {
	validation: {
		body?: TBody;
		pathParams?: TPathParams;
		queryParams?: TQueryParams;
	};
	request: RequestData;
}): Promise<
	| {
			valid: true;
			validRequestData: RequestData<
				z.infer<TBody>,
				z.infer<TPathParams>,
				z.infer<TQueryParams>
			>;
			errors?: never;
	  }
	| {
			valid: false;
			validRequestData?: never;
			errors: {
				body: z.ZodIssue[];
				pathParams: z.ZodIssue[];
				queryParams: z.ZodIssue[];
			};
	  }
> {
	let valid = true;
	const errors: {
		body: z.ZodIssue[];
		pathParams: z.ZodIssue[];
		queryParams: z.ZodIssue[];
	} = {
		body: [],
		pathParams: [],
		queryParams: [],
	};

	if (props.validation.body) {
		const bodyRes = props.validation.body.safeParse(props.request.body);
		if (!bodyRes.success) {
			valid = false;
			errors.body = bodyRes.error.issues;
		}
	}

	if (props.validation.pathParams) {
		const pathParamsRes = props.validation.pathParams.safeParse(props.request.pathParams);
		if (!pathParamsRes.success) {
			valid = false;
			errors.pathParams = pathParamsRes.error.issues;
		}
	}

	if (props.validation.queryParams) {
		const queryParamsRes = props.validation.queryParams.safeParse(props.request.queryParams);
		if (!queryParamsRes.success) {
			valid = false;
			errors.queryParams = queryParamsRes.error.issues;
		} else {
			props.request.queryParams = queryParamsRes.data as z.infer<TQueryParams>;
		}
	}

	if (!valid) {
		return { valid, errors };
	} else {
		return {
			valid,
			validRequestData: props.request as RequestData<
				z.infer<TBody>,
				z.infer<TPathParams>,
				z.infer<TQueryParams>
			>,
		};
	}
}

function toJsonSafe<TData>(obj: any):
	| {
			success: true;
			json: TData;
	  }
	| {
			success: false;
			json?: never;
	  } {
	try {
		const json = JSON.parse(obj);
		return {
			success: true,
			json,
		};
	} catch (e) {
		return { success: false };
	}
}

async function getBody(req: Request): Promise<
	| {
			success: true;
			textBody: string;
			jsonBody: any;
	  }
	| {
			success: false;
			textBody?: never;
			jsonBody?: never;
	  }
> {
	const isJson = req.headers.get("content-type")?.includes("application/json");
	const textBody = await req.text();

	if (isJson) {
		const jsonBodyRes = toJsonSafe(textBody);

		if (!jsonBodyRes.success) {
			return { success: false };
		} else {
			return { success: true, textBody, jsonBody: jsonBodyRes.json };
		}
	} else {
		return { success: true, textBody, jsonBody: undefined };
	}
}

function getPathParams(requestPath: string, handlerPath: string) {
	const requestPathParts = requestPath.split("/");
	const handlerPathParts = handlerPath.split("/");

	const pathParams: Record<string, string> = {};

	for (let i = 0; i < handlerPathParts.length; i++) {
		const handlerPathPart = handlerPathParts[i];
		const requestPathPart = requestPathParts[i];

		if (!requestPathPart || !handlerPathPart) continue;

		if (handlerPathPart.startsWith(":")) {
			const key = handlerPathPart.slice(1);
			pathParams[key] = requestPathPart;
		}
	}

	return pathParams;
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestData<TBody = {}, TPathParams = {}, TQueryParams = {}> = {
	path: string;
	pathParams: TPathParams;
	queryParams: TQueryParams;
	body: TBody;
	textBody: string;
	originalRequest: Request;
};

type Handler<TBody = {}, TPathParams = {}, TQueryParams = {}> = {
	path: string;
	method: Method;
	handle: (
		req: RequestData<TBody, TPathParams, TQueryParams>
	) => Promise<void | Response> | void | Response;
};
