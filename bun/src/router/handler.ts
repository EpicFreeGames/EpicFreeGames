import { Logger } from "../logger";
import { Method, matchMethods } from "./method";
import { Path, matchPaths, prefixPath } from "./path";
import { RequestData, getRequestData } from "./request";

export type Handler = EndpointHandler | RouterHandler;
export type HandlerHandleFunction = (
	req: RequestData,
	prevPathPrefix?: Path
) => Promise<Response | void> | Response | void;

type EndpointHandler = {
	path: Path;
	method: Method;
	type: "endpoint";
	handle: HandlerHandleFunction;
};

type RouterHandler = {
	path: Path;
	method: Method;
	type: "router";
	handle: HandlerHandleFunction;
};

export async function rootHandler(rootPath: string, req: Request, ...handlers: Handler[]) {
	const requestData = await getRequestData(req);

	const handler = matchHandler(requestData, handlers, rootPath as Path);

	return handler?.handle(requestData, rootPath as Path);
}

export function matchHandler(requestData: RequestData, handlers: Handler[], pathPrefix?: Path) {
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

export function get(path: string, handle: HandlerHandleFunction): Handler {
	return {
		path: path as Path,
		method: "GET",
		type: "endpoint",
		handle,
	};
}

export function post(path: string, handle: HandlerHandleFunction): Handler {
	return {
		path: path as Path,
		method: "POST",
		type: "endpoint",
		handle,
	};
}

export function put(path: string, handle: HandlerHandleFunction): Handler {
	return {
		path: path as Path,
		method: "PUT",
		type: "endpoint",
		handle,
	};
}

export function patch(path: string, handle: HandlerHandleFunction): Handler {
	return {
		path: path as Path,
		method: "PATCH",
		type: "endpoint",
		handle,
	};
}

export function del(path: string, handle: HandlerHandleFunction): Handler {
	return {
		path: path as Path,
		method: "DELETE",
		type: "endpoint",
		handle,
	};
}
