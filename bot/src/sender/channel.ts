import { PermissionStrings } from "discordeno";
import { embeds } from "../embeds/mod.ts";
import { languages } from "../i18n/languages.ts";
import { Game } from "../types.ts";
import { getChannel } from "../utils/getChannel.ts";
import { getGuild } from "../utils/getGuild.ts";
import { hasPermsOnChannel } from "../utils/hasPerms.ts";
import { sender } from "./mod.ts";
import { ChannelServer } from "./send.ts";
import { displayRole, logLog, wait } from "./utils.ts";

export const channelSender = async (games: Game[], servers: ChannelServer[], sendingId: string) => {
  for (const server of servers) {
    await wait(30);

    const { channelId: channelIdString, languageCode, id, roleId } = server;
    const guildId = sender.transformers.snowflake(id);
    const channelId = sender.transformers.snowflake(channelIdString);

    const language = languages.get(languageCode) || languages.get("en")!;
    const gameEmbeds = games.map((game) => embeds.games.gameEmbed(game, language, server.currency));

    const channel = await getChannel(sender, guildId, channelId);
    const guild = await getGuild(sender, guildId);

    if (!channel || !guild) {
      logLog({
        serverId: server.id,
        sendingId,
        type: "channel",
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
          type: "channel",
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
          console.log(`new msg` + msg.id);
        });
    });
  }
};
