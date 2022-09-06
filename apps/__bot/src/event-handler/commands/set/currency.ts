import {
  ApplicationCommandOptionChoice,
  InteractionResponseTypes,
  InteractionTypes,
} from "discordeno";

import { api } from "~shared/api.ts";
import { embeds } from "~shared/embeds/mod.ts";
import { Server } from "~shared/types.ts";

import { currencies } from "../../../_shared/i18n/index.ts";
import { getString } from "../../utils/interactionOptions.ts";
import { CommandExecuteProps, EphemeralFlag } from "../mod.ts";
import { autoCompleteSorter } from "./mod.ts";

export const setCurrencyCommand = async ({ bot, i, lang, curr, ...rest }: CommandExecuteProps) => {
  if (i.type === InteractionTypes.ApplicationCommandAutocomplete)
    return autoCompleteHandler({ i, lang, curr, bot, ...rest });

  const currencyCode = getString(i, "currency");

  const { error, data: updatedServer } = await api<Server>({
    method: "PUT",
    path: `/servers/${i.guildId}/currency`,
    body: {
      currencyCode,
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
        embeds.success.updatedSettings(lang),
        embeds.commands.settings(updatedServer, lang, updatedServer.currency),
      ],
    },
  });
};

const autoCompleteHandler = async ({ bot, i }: CommandExecuteProps) => {
  const dirtyQuery = getString(i, "currency") ?? "";

  const query = dirtyQuery?.toLowerCase().trim();

  let results: ApplicationCommandOptionChoice[];

  const currencyList = [...currencies];

  if (query) {
    results = currencyList
      .filter(([_k, currency]) => currency.name.toLowerCase().includes(query))
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

  await bot.helpers.sendInteractionResponse(i.id, i.token, {
    type: InteractionResponseTypes.ApplicationCommandAutocompleteResult,
    data: {
      choices: results,
    },
  });
};
