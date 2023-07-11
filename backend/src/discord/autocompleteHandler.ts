import { APIApplicationCommandAutocompleteInteraction } from "discord-api-types/v10";
import { DiscordRequestContext } from "./context";
import { setCommandAutoCompleteHandler } from "./commands/setCommand/setCommandAutocompleteHandler";
import { isGuildInteraction } from "discord-api-types/utils";

export function autocompleteHandler(
	ctx: DiscordRequestContext,
	i: APIApplicationCommandAutocompleteInteraction
) {
	const commandName = i.data.name;

	if (commandName === "set") {
		if (!isGuildInteraction(i)) return;

		return setCommandAutoCompleteHandler(ctx, i);
	}
}
