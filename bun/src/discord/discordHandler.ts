import {
	APIInteraction,
	APIInteractionResponse,
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import { verifyDiscordRequest } from "./verifyRequest";
import { createResponse } from "./interactions";
import { discordApiRequest } from "./discordApiRequest";
import { Logger } from "../logger";

export async function discordHandler(req: Request) {
	Logger.debug("Incoming interaction request");

	const body = await req.text();

	const verified = await verifyDiscordRequest(req, body);
	if (!verified) {
		Logger.debug("Interaction request failed verification");
		return new Response(undefined, { status: 400 });
	}

	Logger.debug("Interaction request verified");

	const interaction = bodyToInteraction(body);
	if (!interaction) return new Response(undefined, { status: 400 });

	Logger.debug("Interaction request", { interaction });

	if (interaction.type === InteractionType.Ping) {
		return createResponse({
			type: InteractionResponseType.Pong,
		});
	} else {
		try {
			await discordApiRequest({
				method: "POST",
				path: `/api/interactions/${interaction.id}/${interaction.token}/callback`,
				body: <APIInteractionResponse>{
					type: InteractionResponseType.DeferredChannelMessageWithSource,
				},
			});
		} catch (err) {
			return new Response(undefined, { status: 500 });
		}

		return new Response(undefined, { status: 200 });
	}
}

function bodyToInteraction(body: string): APIInteraction | undefined {
	try {
		return JSON.parse(body) as APIInteraction;
	} catch (err) {
		Logger.debug("Interaction was not valid JSON");
		return undefined;
	}
}
