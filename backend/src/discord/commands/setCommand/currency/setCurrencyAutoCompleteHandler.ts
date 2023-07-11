import {
	APIApplicationCommandAutocompleteGuildInteraction,
	APIApplicationCommandOptionChoice,
	ApplicationCommandOptionType,
	InteractionResponseType,
} from "discord-api-types/v10";

import { autoCompleteSorter } from "../_utils";
import { getTypedOption } from "../../_getTypedOption";
import { DiscordRequestContext } from "../../../context";
import { currencies } from "../../../i18n/currency";

const currencyList = [...currencies];

export const setCurrencyAutoCompleteHandler = (
	ctx: DiscordRequestContext,
	i: APIApplicationCommandAutocompleteGuildInteraction
) => {
	const stringOption = getTypedOption(i, ApplicationCommandOptionType.String, "currency");
	if (!stringOption) return;

	const dirtyQuery = stringOption.value ?? "";
	const query = dirtyQuery.toLowerCase().trim();

	let results: APIApplicationCommandOptionChoice[] = [];

	if (query) {
		results = currencyList
			.filter((x) => x[1].name.toLowerCase().includes(query))
			.sort((a, b) => autoCompleteSorter(a[1].name, b[1].name, query))
			.slice(0, 20)
			.map((x) => ({ name: x[1].name, value: x[1].code }));
	} else {
		results = currencyList.slice(0, 20).map((x) => ({ name: x[1].name, value: x[1].code }));
	}

	ctx.respondWith(
		200,
		{
			type: InteractionResponseType.ApplicationCommandAutocompleteResult,
			data: { choices: results },
		},
		false
	);
};
