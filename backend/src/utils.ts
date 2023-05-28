import { Ctx } from "./ctx";

export function objToStr(obj: object) {
	return JSON.stringify(obj, null, 2);
}

export function respondWith(ctx: Ctx, code: number, details?: any) {
	ctx.log("Responding with", { code, details });

	if (details) {
		if (typeof details === "string") {
			return new Response(JSON.stringify({ [code < 400 ? "error" : "message"]: details }), {
				status: code,
				headers: { "Content-Type": "application/json" },
			});
		} else {
			return new Response(JSON.stringify(details), {
				status: code,
				headers: { "Content-Type": "application/json" },
			});
		}
	} else {
		return new Response(undefined, { status: code });
	}
}

export function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
	for (let i = 0; i < arr.length; i += n) {
		yield arr.slice(i, i + n);
	}
}
