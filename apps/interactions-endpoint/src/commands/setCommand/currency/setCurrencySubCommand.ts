import {
  APIApplicationCommandAutocompleteGuildInteraction,
  APIApplicationCommandInteractionDataStringOption,
  APIChatInputApplicationCommandGuildInteraction,
  ApplicationCommandOptionType,
  MessageFlags,
} from "discord-api-types/v10";
import { Response } from "express";

import { embeds } from "@efg/embeds";
import { currencies } from "@efg/i18n";
import { ICurrency, ILanguage, IServer } from "@efg/types";

import { efgApi } from "../../../utils/efgApi/efgApi";
import { interactionGetTypedOption } from "../../../utils/interactions/interactionGetTypedOption";
import { interactionDeferReply } from "../../../utils/interactions/responding/interactionDeferReply";
import { interactionEditReply } from "../../../utils/interactions/responding/interactionEditReply";
import { interactionReply } from "../../../utils/interactions/responding/interactionReply";

export const setCurrencySubCommand = async (
  {
    i,
    server,
    language,
    currency,
  }: {
    i:
      | APIChatInputApplicationCommandGuildInteraction
      | APIApplicationCommandAutocompleteGuildInteraction;
    server?: IServer;
    language: ILanguage;
    currency: ICurrency;
  },
  res: Response
) => {
  interactionDeferReply(res);

  const stringOption = interactionGetTypedOption<APIApplicationCommandInteractionDataStringOption>(
    i,
    ApplicationCommandOptionType.String,
    "currency"
  );

  if (!stringOption) return;
  const newCurrencyCode = stringOption.value;
  const newCurrency = currencies.get(newCurrencyCode);

  if (!newCurrency) {
    console.error(
      `Failed set currency - Cause: Currency not found\nCurrency tried: ${newCurrencyCode}`
    );

    return interactionReply(
      { embeds: [embeds.errors.genericError()], flags: MessageFlags.Ephemeral },
      res
    );
  }

  const { error: serverUpdateError, data: updatedServer } = await efgApi<IServer>({
    method: "PUT",
    path: `/servers/${i.guild_id}/language`,
    body: { currencyCode: newCurrencyCode },
  });

  if (serverUpdateError) {
    console.error(
      `Failed set currency - Cause: Failed to update server to efgApi - Cause: ${serverUpdateError}`
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
};
