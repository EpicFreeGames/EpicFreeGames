import { Handler, matchHandler } from "./handler";
import { Path, prefixPath } from "./path";

export function router(pathPrefix: string, ...handlers: Handler[]): Handler {
	return {
		path: pathPrefix as Path,
		method: "ALL",
		type: "router",
		handle: (requestData, prevPathPrevix) => {
			const handler = matchHandler(
				requestData,
				handlers,
				prevPathPrevix
					? (prefixPath(prevPathPrevix, pathPrefix as Path) as Path)
					: (pathPrefix as Path)
			);

			return handler?.handle(requestData, pathPrefix as Path);
		},
	};
}
