import {
  APIApplicationCommandAutocompleteGuildInteraction,
  APIApplicationCommandInteractionDataRoleOption,
  APIChatInputApplicationCommandGuildInteraction,
  ApplicationCommandOptionType,
  MessageFlags,
  RESTGetAPIGuildRolesResult,
} from "discord-api-types/v10";
import { Response } from "express";

import { embeds } from "@efg/embeds";
import { logger } from "@efg/logger";
import { discordApi, efgApi, objToStr } from "@efg/shared-utils";
import { ICurrency, ILanguage, IServer } from "@efg/types";

import { interactionGetTypedOption } from "../../utils/interactions/interactionGetTypedOption";
import { interactionDeferReply } from "../../utils/interactions/responding/interactionDeferReply";
import { interactionEditReply } from "../../utils/interactions/responding/interactionEditReply";
import { makeSenseOfRole } from "./_utils";

export const setRoleSubCommand = async (
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

  // a channel has to be set before setting a role
  if (!server || !server.channelId)
    return await interactionEditReply(i.token, {
      embeds: [embeds.errors.channelNotSet(language)],
      flags: MessageFlags.Ephemeral,
    });

  const roleOption = interactionGetTypedOption<APIApplicationCommandInteractionDataRoleOption>(
    i,
    ApplicationCommandOptionType.Role,
    "role"
  );
  if (!roleOption) return;

  const selectedRoleId = roleOption.value;
  if (!selectedRoleId) return;

  const { error: roleFetchError, data: guildRoles } = await discordApi<RESTGetAPIGuildRolesResult>({
    method: "GET",
    path: `/guilds/${i.guild_id}/roles`,
  });

  if (roleFetchError) {
    logger.error(
      [
        "Failed to set role",
        "Cause: Failed to fetch guild roles",
        `Cause: ${objToStr(roleFetchError)}`,
        `Selected role ID: ${selectedRoleId}`,
        `Guild ID: ${i.guild_id}`,
      ].join("\n")
    );

    return await interactionEditReply(i.token, {
      embeds: [embeds.errors.genericError()],
      flags: MessageFlags.Ephemeral,
    });
  }

  const guildRole = guildRoles.find((r) => r.id === selectedRoleId);
  if (!guildRole) {
    logger.error(
      [
        "Failed to set role",
        "Cause: Selected role not found in guildRoles",
        `Cause: ${objToStr(roleFetchError)}`,
        `Selected role ID: ${selectedRoleId}`,
        `Guild ID: ${i.guild_id}`,
      ].join("\n")
    );

    return await interactionEditReply(i.token, {
      embeds: [embeds.errors.genericError()],
      flags: MessageFlags.Ephemeral,
    });
  }

  const useful = makeSenseOfRole(guildRole);

  const { data: updatedServer, error: serverUpdateError } = await efgApi<IServer>({
    method: "PUT",
    path: `/servers/${server.id}/role`,
    body: { roleId: useful.toDb },
  });

  if (serverUpdateError) {
    logger.error(
      [
        "Failed to set role",
        "Cause: Failed to update server in efgApi",
        `Cause: ${objToStr(roleFetchError)}`,
        `Selected role ID: ${selectedRoleId}`,
        `Guild ID: ${i.guild_id}`,
      ].join("\n")
    );

    return await interactionEditReply(i.token, {
      embeds: [embeds.errors.genericError()],
      flags: MessageFlags.Ephemeral,
    });
  }

  await interactionEditReply(i.token, {
    embeds: [
      embeds.successes.roleSet(useful.embed, language),
      embeds.commands.settings(updatedServer, language, currency),
    ],
    flags: MessageFlags.Ephemeral,
  });
};
