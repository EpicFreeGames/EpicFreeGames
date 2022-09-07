import {
  ApplicationCommandOptionChoice,
  InteractionResponseTypes,
  InteractionTypes,
} from "discordeno";

import { api } from "~shared/api.ts";
import { embeds } from "~shared/embeds/mod.ts";
import { Server } from "~shared/types.ts";

import { getLanguage, languages } from "../../../_shared/i18n/index.ts";
import { getString } from "../../utils/interactionOptions.ts";
import { CommandExecuteProps, EphemeralFlag } from "../mod.ts";
import { autoCompleteSorter } from "./mod.ts";

export const setLanguageCommand = async ({ bot, i, lang, curr, ...rest }: CommandExecuteProps) => {
  if (i.type === InteractionTypes.ApplicationCommandAutocomplete)
    return autoCompleteHandler({ i, lang, curr, bot, ...rest });

  const languageCode = getString(i, "language");
  const newLanguage = getLanguage(languageCode ?? "")!;
  if (!languageCode || !newLanguage) return;

  const { error, data: updatedServer } = await api<Server>({
    method: "PUT",
    path: `/servers/${i.guildId}/language`,
    body: {
      languageCode,
    },
  });

  if (error)
    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        flags: EphemeralFlag,
        embeds: [embeds.errors.genericError()],
      },
    });

  await bot.helpers.sendInteractionResponse(i.id, i.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      flags: EphemeralFlag,
      embeds: [
        embeds.success.updatedSettings(newLanguage),
        embeds.commands.settings(updatedServer, newLanguage, curr),
      ],
    },
  });
};

const autoCompleteHandler = async ({ bot, i }: CommandExecuteProps) => {
  const dirtyQuery = getString(i, "language") ?? "";

  const query = dirtyQuery?.toLowerCase().trim();

  let results: ApplicationCommandOptionChoice[];

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

  await bot.helpers.sendInteractionResponse(i.id, i.token, {
    type: InteractionResponseTypes.ApplicationCommandAutocompleteResult,
    data: {
      choices: results,
    },
  });
};