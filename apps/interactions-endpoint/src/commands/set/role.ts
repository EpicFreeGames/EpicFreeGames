import {
  APIApplicationCommandInteractionDataRoleOption,
  ApplicationCommandOptionType,
  MessageFlags,
  RESTGetAPIGuildRolesResult,
} from "discord-api-types/v10";

import { embeds } from "@efg/embeds";
import { IServer } from "@efg/types";

import { discordApi } from "../../utils/discordApi/discordApi";
import { efgApi } from "../../utils/efgApi/efgApi";
import { interactionGetTypedOption } from "../../utils/interactions/interactionGetTypedOption";
import { interactionDeferReply } from "../../utils/interactions/responding/interactionDeferReply";
import { interactionEditReply } from "../../utils/interactions/responding/interactionEditReply";
import { SlashCommand } from "../../utils/interactions/types";
import { makeSenseOfRole } from "../../utils/interactions/utils";

export const setRoleCommand: SlashCommand = {
  needsGuild: true,
  needsManageGuild: true,
  execute: async ({ i, server, language, currency }, res) => {
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

    const selectedRoleId = BigInt(roleOption.value);
    if (!selectedRoleId) return;

    const { error: roleFetchError, data: guildRoles } =
      await discordApi<RESTGetAPIGuildRolesResult>({
        method: "GET",
        path: `/guilds/${i.guild_id}/roles`,
      });

    if (roleFetchError) {
      console.error(
        `Failed to set role - Cause: Failed to fetch guild roles - Cause: ${roleFetchError}\nSelected role ID: ${selectedRoleId}\nGuild ID: ${i.guild_id}`
      );

      return await interactionEditReply(i.token, {
        embeds: [embeds.errors.genericError()],
        flags: MessageFlags.Ephemeral,
      });
    }

    const guildRole = guildRoles.find((r) => r.id === String(selectedRoleId));
    if (!guildRole) {
      console.error(
        `Failed to set role - Cause: Selected role not found in guildRoles\nSelected role ID: ${selectedRoleId}\nGuild ID: ${i.guild_id}`
      );

      return await interactionEditReply(i.token, {
        embeds: [embeds.errors.genericError()],
        flags: MessageFlags.Ephemeral,
      });
    }

    const useful = makeSenseOfRole(guildRole);

    const { data: updatedServer, error: serverUpdateError } = await efgApi<IServer>({
      method: "PATCH",
      path: `/servers/${server.id}/role`,
      body: { roleId: selectedRoleId },
    });

    if (serverUpdateError) {
      console.error(
        `Failed to set role - Cause: Failed to update server in efgApi\nSelected role ID: ${selectedRoleId}\nGuild ID: ${i.guild_id}`
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
  },
};
