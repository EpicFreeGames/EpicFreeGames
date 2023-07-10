import { createServer } from "node:http";
import {
	APIInteraction,
	APIInteractionResponseChannelMessageWithSource,
	APIInteractionResponsePong,
	InteractionResponseType,
	InteractionType,
	MessageFlags,
} from "discord-api-types/v10";
import { getTextBody, mergeUint8Arrays, safeJsonParse, valueToUint8Array } from "./utils";
import nacl from "tweetnacl";
import { envs } from "./configuration/envs";

createServer(async (req, res) => {
	const stringBody = await getTextBody(req);

	if (!isValidRequest(req, stringBody)) {
		res.writeHead(401);
		res.end();
		return;
	}

	const jsonBody = safeJsonParse<APIInteraction>(stringBody);

	if (!jsonBody) {
		res.writeHead(400);
		res.end();
		return;
	}

	if (jsonBody.type === InteractionType.Ping) {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({
				type: InteractionResponseType.Pong,
			} satisfies APIInteractionResponsePong)
		);
		return;
	}

	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(
		JSON.stringify({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				flags: MessageFlags.Ephemeral,
				embeds: [
					{
						title: "⚠️ Under Maintenance",
						description:
							"The bot is currently under maintenance ( = being fixed or updated). Please check back later! :)",
						color: 0xfcd41c,
					},
				],
			},
		} satisfies APIInteractionResponseChannelMessageWithSource)
	);
}).listen(8000, () => console.log(`Listening on port 8000`));

const publicKey = valueToUint8Array(envs.DC_PUB_KEY, true);

function isValidRequest(req: Request, stringBody: string) {
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
		return false;
	}
}
