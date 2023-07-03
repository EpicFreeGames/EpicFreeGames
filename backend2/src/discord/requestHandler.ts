import { APIInteraction } from "discord-api-types/v10";
import { IncomingMessage, ServerResponse } from "http";
import nacl from "tweetnacl";
import { envs } from "../configuration/env";
import { Database } from "../db/db";
import { DiscordRequestContext, getDiscordRequestContext } from "./context";
import { interactionHandler } from "./interactionHandler";
import { getTextBody, mergeUint8Arrays, safeJsonParse, valueToUint8Array } from "./utils";

export async function discordRequestHandler(
	req: IncomingMessage,
	res: ServerResponse<IncomingMessage>,
	db: Database
) {
	const requestContext = getDiscordRequestContext(res as Response, db);

	if (req.method !== "POST") {
		requestContext.respondWith(405);
		return;
	}

	const textBody = await getTextBody(req);

	if (!isValidRequest(requestContext, req, textBody)) {
		return requestContext.respondWith(401);
	}

	const jsonBody = safeJsonParse(textBody);
	if (!jsonBody) {
		return requestContext.respondWith(400);
	}

	const interaction = jsonBody as APIInteraction;

	return interactionHandler(requestContext, interaction);
}

export type Request = IncomingMessage;
export type Response = ServerResponse<IncomingMessage>;

const publicKey = valueToUint8Array(envs.DC_PUB_KEY, true);

function isValidRequest(ctx: DiscordRequestContext, req: Request, stringBody: string) {
	const timestampHeader = req.headers["x-signature-timestamp"];
	const signatureHeader = req.headers["x-signature-ed25519"];

	if (
		!timestampHeader ||
		Array.isArray(timestampHeader) ||
		!signatureHeader ||
		Array.isArray(signatureHeader)
	) {
		return false;
	}

	try {
		const timestamp = valueToUint8Array(timestampHeader);
		const body = valueToUint8Array(stringBody);
		const timestampAndBody = mergeUint8Arrays(timestamp, body);

		const signature = valueToUint8Array(signatureHeader, true);
		return nacl.sign.detached.verify(timestampAndBody, signature, publicKey);
	} catch (err) {
		ctx.log("Error verifying Discord request", { err });
		return false;
	}
}
