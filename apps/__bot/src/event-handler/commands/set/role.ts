import { InteractionResponseTypes, Role } from "discordeno";

import { api } from "~shared/api.ts";
import { embeds } from "~shared/embeds/mod.ts";
import { Server } from "~shared/types.ts";
import { getChannel } from "~shared/utils/getChannel.ts";
import { getGuild } from "~shared/utils/getGuild.ts";
import { hasPermsOnChannel } from "~shared/utils/hasPerms.ts";

import { getRoleId } from "../../utils/interactionOptions.ts";
import { CommandExecuteProps, EphemeralFlag } from "../mod.ts";

export const setRoleCommand = async ({ bot, i, server, lang, curr }: CommandExecuteProps) => {
  // server must have a channel set to set a role
  if (!server?.channelId)
    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        flags: EphemeralFlag,
        embeds: [embeds.errors.channelNotSet(lang)],
      },
    });

  const roleId = getRoleId(i, "role");
  if (!roleId) return; // won't happen, but just for fun

  const guild = await getGuild(bot, i.guildId!);
  const channel = await getChannel(bot, i.guildId!, bot.transformers.snowflake(server.channelId));

  const role = guild?.roles.get(roleId);
  if (!role || !guild || !channel) return; // won't happen, but just for fun

  const { toDb, embed } = makeSenseOfRole(role);
  const { hasPerms, details } = await hasPermsOnChannel(bot, channel, guild, ["MENTION_EVERYONE"]);

  if (!hasPerms)
    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        flags: EphemeralFlag,
        embeds: [embeds.errors.missingPermissions(channel.id, lang, details)],
      },
    });

  const { error, data: updatedServer } = await api<Server>({
    method: "PUT",
    path: `/servers/${server.id}/role`,
    body: {
      roleId: toDb,
    },
  });

  await bot.helpers.sendInteractionResponse(i.id, i.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      flags: EphemeralFlag,
      embeds: error
        ? [embeds.errors.genericError()]
        : [
            embeds.success.roleSet(embed, lang),
            embeds.commands.settings(updatedServer, lang, curr),
          ],
    },
  });
};

const makeSenseOfRole = (role: Role) => {
  if (role.name === "@everyone") return { embed: "@everyone", toDb: "1" };
  return { embed: `<@&${role.id}>`, toDb: String(role.id) };
};