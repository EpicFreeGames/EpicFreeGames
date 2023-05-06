export function objToStr(obj: object) {
	return JSON.stringify(obj, null, 2);
}

export function createResponse(status: number, body?: unknown) {
	return new Response(!!body ? JSON.stringify(body) : undefined, {
		status,
		...(!!body && { headers: { "Content-Type": "application/json" } }),
	});
}
