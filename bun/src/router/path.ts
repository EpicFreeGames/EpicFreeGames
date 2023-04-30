export type Path = string & { __type: "Path" };

export function matchPaths(left: Path, right: Path) {
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

export function extractUrlData(url: URL) {
	const queryParams = Object.fromEntries(url.searchParams.entries());

	return {
		queryParams: queryParams,
		pathParams: extractPathParams(url.pathname as Path),
	};
}

export function prefixPath(prefix: Path, path: Path): Path {
	if (prefix === "/") {
		return path as Path;
	}
	if (path === "/") {
		return prefix as unknown as Path;
	}
	return `${prefix}${path}` as Path;
}

function extractPathParams(path: Path) {
	const parts = path.split("/");
	const data: { [key: string]: string } = {};
	for (const part of parts) {
		if (part.startsWith(":")) {
			const key = part.slice(1);
			data[key] = part;
		}
	}
	return data;
}
