import { IncomingMessage } from "http";

export function valueToUint8Array(
	value: Uint8Array | ArrayBuffer | Buffer | string,
	isHex?: boolean
): Uint8Array {
	if (value == null) {
		return new Uint8Array();
	}

	if (typeof value === "string") {
		if (isHex) {
			const matches = value.match(/.{1,2}/g);
			if (matches == null) {
				throw new Error("Value is not a valid hex string");
			}
			const hexVal = matches.map((byte: string) => parseInt(byte, 16));
			return new Uint8Array(hexVal);
		} else {
			return new TextEncoder().encode(value);
		}
	}

	if (Buffer.isBuffer(value)) {
		return new Uint8Array(value);
	}

	if (value instanceof ArrayBuffer) {
		return new Uint8Array(value);
	}

	if (value instanceof Uint8Array) {
		return value;
	}

	throw new Error(
		`Value is not a valid string, Buffer, ArrayBuffer, or Uint8Array - Value: ${value}`
	);
}

export function mergeUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
	const c = new Uint8Array(a.length + b.length);
	c.set(a);
	c.set(b, a.length);
	return c;
}

export function objToStr(obj: Record<string, unknown>) {
	return JSON.stringify(obj, null, 4);
}

export function getTextBody(req: IncomingMessage): Promise<string> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		req.on("data", (chunk) => chunks.push(chunk));
		req.on("end", () => {
			const body = Buffer.concat(chunks).toString();
			resolve(body);
		});
		req.on("error", reject);
	});
}

export function safeJsonParse<T>(jsonString: string): T | null {
	try {
		return JSON.parse(jsonString) as T;
	} catch (e) {
		return null;
	}
}
