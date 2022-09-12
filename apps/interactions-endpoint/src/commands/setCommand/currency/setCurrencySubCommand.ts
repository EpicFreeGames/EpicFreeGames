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
import { logger } from "@efg/logger";
import { efgApi, objToStr } from "@efg/shared-utils";
import { ICurrency, ILanguage, IServer } from "@efg/types";

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
  interactionDeferReply(res, { ephemeral: true });

  const stringOption = interactionGetTypedOption<APIApplicationCommandInteractionDataStringOption>(
    i,
    ApplicationCommandOptionType.String,
    "currency"
  );

  if (!stringOption) return;
  const newCurrencyCode = stringOption.value;
  const newCurrency = currencies.get(newCurrencyCode);

  if (!newCurrency) {
    logger.error(
      `Failed set currency - Cause: Currency not found\nCurrency tried: ${newCurrencyCode}`
    );

    logger.error(
      [
        "Failed set currency",
        "Cause: Currency not found",
        `Currency tried: ${newCurrencyCode}`,
      ].join("\n")
    );

    return interactionReply(
      { embeds: [embeds.errors.genericError()], flags: MessageFlags.Ephemeral },
      res
    );
  }

  const { error: serverUpdateError, data: updatedServer } = await efgApi<IServer>({
    method: "PUT",
    path: `/servers/${i.guild_id}/currency`,
    body: { currencyCode: newCurrencyCode },
  });

  if (serverUpdateError) {
    logger.error(
      [
        "Failed set currency",
        "Cause: Failed to update server to efgApi",
        `Cause: ${objToStr(serverUpdateError)}`,
      ].join("\n")
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
