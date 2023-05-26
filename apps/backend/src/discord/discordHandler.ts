import {
	type APIInteraction,
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import { IncomingMessage, ServerResponse } from "node:http";

import { type Database } from "@efg/db";

import { getCtx } from "../ctx";
import { respondWith } from "../utils";
import { commandHandler } from "./commands/commandHandler";
import { verifyDiscordRequest } from "./verifyRequest";

export const discordHandler = async (
	req: IncomingMessage,
	res: ServerResponse<IncomingMessage>,
	db: Database
) => {
	const ctx = getCtx(req, res, db);

	const textBody = await new Promise<string>((resolve) => {
		let data = "";
		req.on("data", (chunk) => {
			data += chunk;
		});
		req.on("end", () => {
			resolve(data);
		});
	});

	ctx.logger.debug("Incoming interaction request");

	const verified = await verifyDiscordRequest(
		textBody,
		req.headers["x-signature-timestamp"] as string,
		req.headers["x-signature-ed25519"] as string
	);
	if (!verified) {
		return respondWith(res, 401, "Invalid request signature");
	}

	ctx.logger.debug("Interaction request verified");

	let jsonBody = null;
	try {
		jsonBody = JSON.parse(textBody);
	} catch (err) {
		ctx.logger.debug("Error parsing interaction request body", { err });
		return respondWith(res, 400, "Invalid request body");
	}

	const interaction = jsonBody as APIInteraction;
	if (!interaction) return respondWith(res, 400, "Invalid request");

	ctx.logger.debug("Interaction request", { interaction });

	if (interaction.type === InteractionType.Ping) {
		return respondWith(res, 200, { type: InteractionResponseType.Pong });
	} else {
		const language = {
			code: "en",
			englishName: "English",
			name: "English",
			websiteReady: true,
		};

		const currency = {
			after: "€",
			before: "",
			code: "EUR",
			englishName: "Euro",
			name: "Euro",
		};

		await commandHandler(ctx, interaction, language, currency, null);
	}
};

export function isDiscordRequest(req: IncomingMessage) {
	return req.url === "/discord" && req.method === "POST";
}
