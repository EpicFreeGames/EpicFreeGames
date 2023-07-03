import {
	APIApplicationCommandAutocompleteGuildInteraction,
	ApplicationCommandOptionType,
} from "discord-api-types/v10";
import { DiscordRequestContext } from "../../context";
import { getTypedOption } from "../_getTypedOption";
import { setCurrencyAutoCompleteHandler } from "./currency/setCurrencyAutoCompleteHandler";
import { setLanguageAutoCompleteHandler } from "./language/setLanguageAutoCompleteHandler";

export function setCommandAutoCompleteHandler(
	ctx: DiscordRequestContext,
	i: APIApplicationCommandAutocompleteGuildInteraction
) {
	const subCommand = getTypedOption(i, ApplicationCommandOptionType.Subcommand);
	if (!subCommand) return;

	if (subCommand.name === "language") {
		return setLanguageAutoCompleteHandler(ctx, i);
	} else if (subCommand.name === "currency") {
		return setCurrencyAutoCompleteHandler(ctx, i);
	}
}
