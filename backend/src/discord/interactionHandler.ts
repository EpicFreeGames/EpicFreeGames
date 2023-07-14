import { APIInteraction, InteractionType } from "discord-api-types/v10";
import { DiscordRequestContext } from "./context";
import { commandHandler } from "./commandHandler";
import { autocompleteHandler } from "./autocompleteHandler";

export function interactionHandler(ctx: DiscordRequestContext, i: APIInteraction) {
	if (i.type === InteractionType.Ping) {
		return ctx.respondWith(200, { type: 1 });
	} else if (i.type === InteractionType.ApplicationCommand) {
		return commandHandler(ctx, i);
	} else if (i.type === InteractionType.ApplicationCommandAutocomplete) {
		return autocompleteHandler(ctx, i);
	}
}
