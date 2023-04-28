import { APIInteraction, InteractionResponseType, InteractionType } from "discord-api-types/v10";
import { verifyDiscordRequest } from "./verifyRequest";
import { createResponse } from "./interactions";

export async function discordHandler(req: Request) {
	const body = await req.text();

	const verified = await verifyDiscordRequest(req, body);
	if (!verified) {
		return new Response(undefined, { status: 400 });
	}

	const interaction = JSON.parse(body) as APIInteraction;

	if (interaction.type === InteractionType.Ping) {
		return createResponse({
			type: InteractionResponseType.Pong,
		});
	}

	return new Response(undefined, { status: 404 });
}
