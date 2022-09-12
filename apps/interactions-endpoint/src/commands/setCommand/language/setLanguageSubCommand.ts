import {
  APIApplicationCommandInteractionDataStringOption,
  APIChatInputApplicationCommandGuildInteraction,
  ApplicationCommandOptionType,
  MessageFlags,
} from "discord-api-types/v10";
import { Response } from "express";

import { embeds } from "@efg/embeds";
import { languages } from "@efg/i18n";
import { logger } from "@efg/logger";
import { efgApi, objToStr } from "@efg/shared-utils";
import { ICurrency, ILanguage, IServer } from "@efg/types";

import { interactionGetTypedOption } from "../../../utils/interactions/interactionGetTypedOption";
import { interactionDeferReply } from "../../../utils/interactions/responding/interactionDeferReply";
import { interactionEditReply } from "../../../utils/interactions/responding/interactionEditReply";
import { interactionReply } from "../../../utils/interactions/responding/interactionReply";

export const setLanguageSubCommand = async (
  {
    i,
    server,
    language,
    currency,
  }: {
    i: APIChatInputApplicationCommandGuildInteraction;
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
    "language"
  );
  if (!stringOption) return;

  const newLanguageCode = stringOption.value;
  const newLanguage = languages.get(newLanguageCode);

  if (!newLanguage) {
    logger.error(
      [
        "Failed set language",
        "Cause: Language not found",
        `Language tried: ${newLanguageCode}`,
      ].join("\n")
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
    logger.error(
      [
        "Failed set language",
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
      embeds.successes.updatedSettings(updatedServer.language),
      embeds.commands.settings(updatedServer, language, currency),
    ],
    flags: MessageFlags.Ephemeral,
  });
};
