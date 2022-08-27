import { PermissionStrings } from "discordeno";

import { embeds } from "~shared/embeds/mod.ts";
import { Game } from "~shared/types.ts";
import { displayRole } from "~shared/utils/displayRole.ts";
import { getChannel } from "~shared/utils/getChannel.ts";
import { getGuild } from "~shared/utils/getGuild.ts";
import { hasPermsOnChannel } from "~shared/utils/hasPerms.ts";
import { logger } from "~shared/utils/logger.ts";

import { sender } from "./mod.ts";
import { MessageServer, logLog, wait } from "./utils.ts";

export const messageSender = async (games: Game[], servers: MessageServer[], sendingId: string) => {
  for (const server of servers) {
    await wait(30);

    const { channelId: channelIdString, language, id, roleId } = server;
    const guildId = sender.transformers.snowflake(id);
    const channelId = sender.transformers.snowflake(channelIdString);

    const gameEmbeds = games.map((game) => embeds.games.gameEmbed(game, language, server.currency));

    const channel = await getChannel(sender, guildId, channelId);
    const guild = await getGuild(sender, guildId);

    if (!channel || !guild) {
      logLog({
        serverId: server.id,
        sendingId,
        type: "MESSAGE",
        result: "channel or guild not found",
        success: false,
      });

      continue;
    }

    const role = displayRole(roleId);

    hasPermsOnChannel(sender, channel, guild, [
      "VIEW_CHANNEL",
      "SEND_MESSAGES",
      "EMBED_LINKS",
      ...(role ? ["MENTION_EVERYONE" as PermissionStrings] : []), // check only if server has a set role
    ]).then(({ details, hasPerms }) => {
      if (!hasPerms) {
        logLog({
          serverId: server.id,
          sendingId,
          type: "MESSAGE",
          result: `Missing perms, details: ${details
            .map((hasPerm, perm) => `${perm}: ${hasPerm}`)
            .join(", ")}`,
          success: false,
        });

        return;
      }

      sender.helpers
        .sendMessage(channelId, {
          ...(role ? { content: role } : {}),
          embeds: gameEmbeds,
        })
        .then((msg) => {
          logger.info(`(message) ${sendingId} sent ${games.length} games to ${server.id}`);
        });
    });
  }
};
