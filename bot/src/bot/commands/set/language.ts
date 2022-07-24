import {
  ApplicationCommandOptionChoice,
  InteractionResponseTypes,
  InteractionTypes,
} from "https://deno.land/x/discordeno@13.0.0-rc45/mod.ts";
import { api } from "../../../api.ts";
import { embeds } from "../../../embeds/mod.ts";
import { languages } from "../../../i18n/languages.ts";
import { Server } from "../../../types.ts";
import { bot } from "../../mod.ts";
import { getString } from "../../utils/interactionOptions.ts";
import { CommandExecuteProps } from "../mod.ts";

export const setLanguageCommand = async ({ i, lang, curr, ...rest }: CommandExecuteProps) => {
  if (i.type === InteractionTypes.ApplicationCommandAutocomplete)
    return autoCompleteHandler({ i, lang, curr, ...rest });

  const languageCode = getString(i, "language");
  if (!languageCode || !languages.has(languageCode)) return;

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
        flags: 64,
        embeds: [embeds.errors.genericError()],
      },
    });

  const newLanguage = languages.get(languageCode)!;

  await bot.helpers.sendInteractionResponse(i.id, i.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      flags: 64,
      embeds: [
        embeds.success.updatedSettings(newLanguage),
        embeds.commands.settings(updatedServer, newLanguage, curr),
      ],
    },
  });
};

const autoCompleteHandler = async ({ bot, i, lang, curr }: CommandExecuteProps) => {
  const dirtyQuery = getString(i, "language") ?? "";

  const query = dirtyQuery?.toLowerCase().trim();

  let results: ApplicationCommandOptionChoice[];

  if (query) {
    results = [...languages.entries()]
      .filter(([_k, v]) => v.nativeName.toLowerCase().includes(query))
      .sort(([_aKey, aValue], [_bKey, bValue]) => {
        if (aValue.nativeName.toLowerCase().startsWith(query)) return -1;
        if (bValue.nativeName.toLowerCase().startsWith(query)) return 1;

        return 0;
      })
      .slice(0, 20)
      .map(([_key, value]) => ({
        name: value.nativeName,
        value: value.code,
      }));
  } else {
    results = [...languages.entries()].slice(0, 20).map(([_key, value]) => ({
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
