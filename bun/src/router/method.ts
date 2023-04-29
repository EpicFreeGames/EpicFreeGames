export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS" | "ALL";

export function matchMethods(left: Method, right: Method) {
	if (right === "ALL" || left === "ALL") {
		return true;
	}

	return left === right;
}
