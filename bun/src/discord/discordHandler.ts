import {
	APIInteraction,
	APIInteractionResponse,
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import { verifyDiscordRequest } from "./verifyRequest";
import { discordApiRequest } from "./discordApiRequest";
import { Logger } from "../logger";
import { createResponse } from "../utils";
import { Router } from "../router/router";

export const discordRouter = new Router().post("/discord", async (req) => {
	Logger.debug("Incoming interaction request");

	const verified = await verifyDiscordRequest(req.originalRequest, req.textBody);
	if (!verified) {
		return createResponse(400, { error: "Invalid request signature" });
	}

	Logger.debug("Interaction request verified");

	const interaction = req.body as APIInteraction;
	if (!interaction) return new Response(undefined, { status: 400 });

	Logger.debug("Interaction request", { interaction });

	if (interaction.type === InteractionType.Ping) {
		return createResponse(200, {
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
			return createResponse(500, { error: "Failed to send interaction response" });
		}

		return createResponse(200);
	}
});
