import nacl from "tweetnacl";

import { env } from "../configuration/env";
import { Logger } from "../logger";

const publicKey = valueToUint8Array(env.DC_PUB_KEY, true);

export async function verifyDiscordRequest(
	stringBody: string,
	timestampHeader: string,
	signatureHeader: string
) {
	if (!timestampHeader || !signatureHeader) {
		return false;
	}

	try {
		const timestamp = valueToUint8Array(timestampHeader);
		const body = valueToUint8Array(stringBody);
		const timestampAndBody = mergeUint8Arrays(timestamp, body);

		const signature = valueToUint8Array(signatureHeader, true);
		return nacl.sign.detached.verify(timestampAndBody, signature, publicKey);
	} catch (err) {
		Logger.debug("Error verifying Discord request", { err });
		return false;
	}
}

function valueToUint8Array(
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

function mergeUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
	const c = new Uint8Array(a.length + b.length);
	c.set(a);
	c.set(b, a.length);
	return c;
}
