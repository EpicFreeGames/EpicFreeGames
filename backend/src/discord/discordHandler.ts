import { getCtx } from "../ctx";
import { Database } from "../db/db";
import { respondWith } from "../utils";
import { commandHandler } from "./commands/commandHandler";
import { verifyDiscordRequest } from "./verifyRequest";
import {
	type APIInteraction,
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import { IncomingMessage } from "node:http";

export const discordHandler = async (req: Request, db: Database) => {
	const ctx = getCtx(req, db);

	const textBody = await req.text();

	ctx.log("Incoming interaction request");

	const verified = await verifyDiscordRequest(
		ctx,
		textBody,
		req.headers.get("x-signature-timestamp"),
		req.headers.get("x-signature-ed25519")
	);
	if (!verified) {
		return respondWith(ctx, 401, "Invalid request signature");
	}

	ctx.log("Interaction request verified");

	let jsonBody = null;
	try {
		jsonBody = JSON.parse(textBody);
	} catch (err) {
		ctx.log("Error parsing interaction request body", { err });
		return respondWith(ctx, 400, "Invalid request body");
	}

	const interaction = jsonBody as APIInteraction;
	if (!interaction) return respondWith(ctx, 400, "Invalid request");

	if (interaction.type === InteractionType.Ping) {
		return respondWith(ctx, 200, { type: InteractionResponseType.Pong });
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

		return await commandHandler(ctx, interaction, language, currency, null);
	}
};

export function isDiscordRequest(req: IncomingMessage) {
	return req.url === "/discord" && req.method === "POST";
}
