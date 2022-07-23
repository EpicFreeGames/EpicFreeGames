import { InteractionResponseTypes } from "discordeno";
import { api } from "../../../api.ts";
import { embeds } from "../../../embeds/mod.ts";
import { Server } from "../../../types.ts";
import { getRoleId } from "../../utils/interactionOptions.ts";
import { CommandExecuteProps } from "../mod.ts";

export const setRoleCommand = async ({
  bot,
  i,
  server,
  lang,
}: CommandExecuteProps) => {
  // server must have a channel set to set a role
  if (!server?.channelId)
    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        embeds: [embeds.errors.channelNotSet(lang)],
      },
    });

  const roleId = getRoleId(i, "roleId");
  if (!roleId) return; // won't happen, but just in case

  const guild = await bot.helpers.getGuild(i.guildId!)!;
  const role = guild?.roles.get(roleId);
  if (!role) return; // won't happen, but just in case

  const { error, data: updatedServer } = await api<Server>(
    "PUT",
    `/servers/${server.id}/role`,
    {
      roleId: String(role.id),
    }
  );

  await bot.helpers.sendInteractionResponse(i.id, i.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      embeds: error
        ? [embeds.errors.genericError()]
        : [
            embeds.success.updatedSettings(lang),
            embeds.commands.settings(updatedServer, lang),
          ],
    },
  });
};
