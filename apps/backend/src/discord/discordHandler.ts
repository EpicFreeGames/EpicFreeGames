import { APIInteraction, InteractionResponseType, InteractionType } from "discord-api-types/v10";
import { IncomingMessage } from "node:http";

import { Logger } from "@/logger";

import { discordApiRequest } from "./discordApiRequest";
import { verifyDiscordRequest } from "./verifyRequest";

export const discordHandler = async (req: IncomingMessage) => {
	const textBody = await new Promise<string>((resolve) => {
		let data = "";
		req.on("data", (chunk) => {
			data += chunk;
		});
		req.on("end", () => {
			resolve(data);
		});
	});

	Logger.debug("Incoming interaction request");

	const verified = await verifyDiscordRequest(
		textBody,
		req.headers["x-signature-timestamp"] as string,
		req.headers["x-signature-ed25519"] as string
	);
	if (!verified) {
		return { code: 400, body: undefined };
	}

	Logger.debug("Interaction request verified");

	let jsonBody = null;
	try {
		jsonBody = JSON.parse(textBody);
	} catch (err) {
		Logger.debug("Error parsing interaction request body", { err });
		return { code: 400, body: undefined };
	}

	const interaction = jsonBody as APIInteraction;
	if (!interaction) return { code: 400, body: undefined };

	Logger.debug("Interaction request", { interaction });

	if (interaction.type === InteractionType.Ping) {
		return { code: 200, body: { type: InteractionResponseType.Pong } };
	} else {
		try {
			await discordApiRequest({
				method: "POST",
				path: `/api/interactions/${interaction.id}/${interaction.token}/callback`,
				body: {
					type: InteractionResponseType.DeferredChannelMessageWithSource,
				},
			});
		} catch (err) {
			return { code: 400, body: undefined };
		}

		return { code: 200, body: undefined };
	}
};

export function isDiscordRequest(req: IncomingMessage) {
	return req.url === "/discord" && req.method === "POST";
}
