import { Logger } from "../logger";
import { Method, matchMethods } from "./method";
import { Path, matchPaths, prefixPath } from "./path";
import { RequestData, getRequestData } from "./request";
import { createResponse } from "../utils";
import { HandlerValidation, validateRequestData } from "./validation";
import { z } from "zod";

export type Handler<
	TBody extends z.ZodType<{}>,
	TPathParams extends z.ZodType<{}>,
	TQueryParams extends z.ZodType<{}>
> =
	| EndpointHandler<TBody, TPathParams, TQueryParams>
	| RouterHandler<TBody, TPathParams, TQueryParams>;

export type HandlerHandleFunction<
	TBody extends z.ZodType<{}>,
	TPathParams extends z.ZodType<{}>,
	TQueryParams extends z.ZodType<{}>
> = (
	req: RequestData<TBody, TPathParams, TQueryParams>,
	prevPathPrefix?: Path
) => Promise<Response | void> | Response | void;

type EndpointHandler<
	TBody extends z.ZodType<{}>,
	TPathParams extends z.ZodType<{}>,
	TQueryParams extends z.ZodType<{}>
> = {
	path: Path;
	method: Method;
	type: "endpoint";
	handle: HandlerHandleFunction<TBody, TPathParams, TQueryParams>;
};

type RouterHandler<
	TBody extends z.ZodType<{}>,
	TPathParams extends z.ZodType<{}>,
	TQueryParams extends z.ZodType<{}>
> = {
	path: Path;
	method: Method;
	type: "router";
	handle: HandlerHandleFunction<TBody, TPathParams, TQueryParams>;
};

export async function rootHandler<
	TBody extends z.ZodType<{}>,
	TPathParams extends z.ZodType<{}>,
	TQueryParams extends z.ZodType<{}>
>(rootPath: string, req: Request, ...handlers: Handler<TBody, TPathParams, TQueryParams>[]) {
	const requestData = await getRequestData(req);

	const handler = matchHandler(requestData, handlers, rootPath as Path);

	return handler?.handle(requestData, rootPath as Path);
}

export function matchHandler<
	TBody extends z.ZodType<{}>,
	TPathParams extends z.ZodType<{}>,
	TQueryParams extends z.ZodType<{}>
>(
	requestData: RequestData<TBody, TPathParams, TQueryParams>,
	handlers: Handler<TBody, TPathParams, TQueryParams>[],
	pathPrefix?: Path
) {
	Logger.debug("Matching handler", {
		requestPath: requestData.path,
		requestMethod: requestData.method,
		pathPrefix,
	});

	const matchingHandler = handlers.find((handler) => {
		const handlerPath = pathPrefix ? prefixPath(pathPrefix, handler.path) : handler.path;

		return (
			matchMethods(handler.method, requestData.method) &&
			matchPaths(handlerPath, requestData.path)
		);
	});

	if (!!matchingHandler) {
		Logger.debug("Matched handler", {
			requestPath: requestData.path,
			requestMethod: requestData.method,
			pathPrefix,
			handlerPath: matchingHandler.path,
			prefixedHandlerPath: pathPrefix
				? prefixPath(pathPrefix, matchingHandler.path)
				: matchingHandler.path,
			handlerMethod: matchingHandler.method,
			handlerType: matchingHandler.type,
		});
	} else {
		Logger.debug("No matching handler", {
			requestPath: requestData.path,
			requestMethod: requestData.method,
			pathPrefix,
		});
	}

	return matchingHandler;
}

export function get<
	TBody extends z.ZodType<{}>,
	TPathParams extends z.ZodType<{}>,
	TQueryParams extends z.ZodType<{}>
>(
	path: string,
	props: {
		validation?: Omit<HandlerValidation<TBody, TPathParams, TQueryParams>, "body">;
		handle: HandlerHandleFunction<TBody, TPathParams, TQueryParams>;
	}
): Handler<TBody, TPathParams, TQueryParams> {
	return {
		path: path as Path,
		method: "GET",
		type: "endpoint",
		handle: (req, prevPathPrefix) =>
			handleWithValidation<TBody, TPathParams, TQueryParams>({
				validation: props.validation,
				handle: props.handle,
				req,
				prevPathPrefix,
			}),
	};
}

async function handleWithValidation<
	TBody extends z.ZodType<{}>,
	TPathParams extends z.ZodType<{}>,
	TQueryParams extends z.ZodType<{}>
>(props: {
	validation?: HandlerValidation<TBody, TPathParams, TQueryParams>;
	handle: HandlerHandleFunction<TBody, TPathParams, TQueryParams>;
	req: RequestData<TBody, TPathParams, TQueryParams>;
	prevPathPrefix?: Path;
}) {
	if (!props.validation) return props.handle(props.req, props.prevPathPrefix);

	const validationResult = await validateRequestData<TBody, TPathParams, TQueryParams>(
		props.req,
		props.validation
	);

	if (!validationResult.valid) {
		return createResponse(400, { errors: validationResult.errors });
	}

	return props.handle(validationResult.req, props.prevPathPrefix);
}
