import { APIInteractionResponse } from "discord-api-types/v10";

export const createResponse = (interactionResponse: APIInteractionResponse) => {
	return new Response(JSON.stringify(interactionResponse), {
		headers: { "Content-Type": "application/json" },
		status: 200,
	});
};
