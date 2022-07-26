import {
  ApplicationCommandOptionChoice,
  InteractionResponseTypes,
  InteractionTypes,
} from "discordeno";
import { api } from "~shared/api.ts";
import { embeds } from "~shared/embeds/mod.ts";
import { Currency, Server } from "~shared/types.ts";
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

  const { error, data: currencies } = await api<Currency[]>({
    method: "GET",
    path: "/currencies",
  });

  if (error) return;

  if (query) {
    results = currencies
      .filter((currency) => currency.name.toLowerCase().includes(query))
      .sort((a, b) => autoCompleteSorter({ a: a.name, b: b.name, query }))
      .slice(0, 20)
      .map((currency) => ({
        name: currency.name,
        value: currency.code,
      }));
  } else {
    results = currencies.slice(0, 20).map((currency) => ({
      name: currency.name,
      value: currency.code,
    }));
  }

  await bot.helpers.sendInteractionResponse(i.id, i.token, {
    type: InteractionResponseTypes.ApplicationCommandAutocompleteResult,
    data: {
      choices: results,
    },
  });
};
