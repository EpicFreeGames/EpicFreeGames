import {
  APIApplicationCommandAutocompleteGuildInteraction,
  APIApplicationCommandInteractionDataStringOption,
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
  InteractionType,
  MessageFlags,
} from "discord-api-types/v10";
import { Response } from "express";

import { embeds } from "@efg/embeds";
import { languages } from "@efg/i18n";
import { IServer } from "@efg/types";

import { efgApi } from "../../utils/efgApi/efgApi";
import { interactionGetTypedOption } from "../../utils/interactions/interactionGetTypedOption";
import { interactionDeferReply } from "../../utils/interactions/responding/interactionDeferReply";
import { interactionEditReply } from "../../utils/interactions/responding/interactionEditReply";
import { interactionReply } from "../../utils/interactions/responding/interactionReply";
import { SlashCommand } from "../../utils/interactions/types";
import { autoCompleteSorter } from "./_utils";

export const setLanguageCommand: SlashCommand = {
  needsGuild: true,
  needsManageGuild: true,
  execute: async ({ i, server, language, currency }, res) => {
    if (i.type === InteractionType.ApplicationCommandAutocomplete)
      return autoCompleteHandler(i, res);

    interactionDeferReply(res);

    const stringOption =
      interactionGetTypedOption<APIApplicationCommandInteractionDataStringOption>(
        i,
        ApplicationCommandOptionType.String,
        "language"
      );

    if (!stringOption) return;
    const newLanguageCode = stringOption.value;
    const newLanguage = languages.get(newLanguageCode);

    if (!newLanguage) {
      console.error(
        `Failed set language - Cause: Language not found\nLanguage tried: ${newLanguageCode}`
      );

      return interactionReply(
        { embeds: [embeds.errors.genericError()], flags: MessageFlags.Ephemeral },
        res
      );
    }

    const { error: serverUpdateError, data: updatedServer } = await efgApi<IServer>({
      method: "PUT",
      path: `/servers/${i.guild_id}/language`,
      body: { languageCode: newLanguageCode },
    });

    if (serverUpdateError) {
      console.error(
        `Failed set language - Cause: Failed to update server to efgApi - Cause: ${serverUpdateError}`
      );

      return interactionReply(
        { embeds: [embeds.errors.genericError()], flags: MessageFlags.Ephemeral },
        res
      );
    }

    interactionEditReply(i.token, {
      embeds: [
        embeds.successes.updatedSettings(language),
        embeds.commands.settings(updatedServer, language, currency),
      ],
      flags: MessageFlags.Ephemeral,
    });
  },
};

const autoCompleteHandler = (
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

  interactionReply({ choices: results }, res);
};
