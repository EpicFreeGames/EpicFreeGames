import {
  APIApplicationCommandAutocompleteGuildInteraction,
  APIApplicationCommandInteractionDataStringOption,
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
} from "discord-api-types/v10";
import { Response } from "express";

import { languages } from "@efg/i18n";

import { interactionGetTypedOption } from "../../../utils/interactions/interactionGetTypedOption";
import { interactionAutocompleteReply } from "../../../utils/interactions/responding/interactionAutocompleteReply";
import { autoCompleteSorter } from "../_utils";

export const setLanguageAutoCompleteHandler = (
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

  const languageList = [...languages];

  if (query) {
    results = languageList
      .filter(([_k, v]) => v.nativeName.toLowerCase().includes(query))
      .sort(([_aKey, aValue], [_bKey, bValue]) =>
        autoCompleteSorter({ a: aValue.nativeName, b: bValue.nativeName, query })
      )
      .slice(0, 20)
      .map(([_key, value]) => ({
        name: value.nativeName,
        value: value.code,
      }));
  } else {
    results = languageList.slice(0, 20).map(([_key, value]) => ({
      name: value.nativeName,
      value: value.code,
    }));
  }

  interactionAutocompleteReply({ choices: results }, res);
};
