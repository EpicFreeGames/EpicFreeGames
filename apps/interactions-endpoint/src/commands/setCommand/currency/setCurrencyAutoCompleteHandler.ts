import {
  APIApplicationCommandAutocompleteGuildInteraction,
  APIApplicationCommandInteractionDataStringOption,
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
} from "discord-api-types/v10";
import { Response } from "express";

import { currencies } from "@efg/i18n";

import { interactionGetTypedOption } from "../../../utils/interactions/interactionGetTypedOption";
import { interactionAutocompleteReply } from "../../../utils/interactions/responding/interactionAutocompleteReply";
import { autoCompleteSorter } from "../_utils";

export const setCurrencyAutoCompleteHandler = (
  i: APIApplicationCommandAutocompleteGuildInteraction,
  res: Response
) => {
  const stringOption = interactionGetTypedOption<APIApplicationCommandInteractionDataStringOption>(
    i,
    ApplicationCommandOptionType.String,
    "language"
  );
  if (!stringOption) return;

  const dirtyQuery = stringOption.value ?? "";
  const query = dirtyQuery.toLowerCase().trim();

  let results: APIApplicationCommandOptionChoice[] = [];

  const currencyList = [...currencies];

  if (query) {
    results = currencyList
      .filter(([_k, v]) => v.name.toLowerCase().includes(query))
      .sort(([_aKey, aValue], [_bKey, bValue]) =>
        autoCompleteSorter({ a: aValue.name, b: bValue.name, query })
      )
      .slice(0, 20)
      .map(([_key, value]) => ({
        name: value.name,
        value: value.code,
      }));
  } else {
    results = currencyList.slice(0, 20).map(([_key, value]) => ({
      name: value.name,
      value: value.code,
    }));
  }

  interactionAutocompleteReply({ choices: results }, res);
};
