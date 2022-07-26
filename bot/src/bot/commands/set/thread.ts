import { InteractionResponseTypes, PermissionStrings } from "discordeno";
import { api } from "../../../api.ts";
import { config } from "../../../config.ts";
import { embeds } from "../../../embeds/mod.ts";
import { Game, Server } from "../../../types.ts";
import { getChannel } from "../../../utils/getChannel.ts";
import { getGuild } from "../../../utils/getGuild.ts";
import { hasPermsOnChannel } from "../../../utils/hasPerms.ts";
import { logger } from "../../../utils/logger.ts";
import { executeWebhook } from "../../../utils/webhook.ts";
import { getChannelId } from "../../utils/interactionOptions.ts";
import { CommandExecuteProps, EphemeralFlag } from "../mod.ts";

export const setThreadCommand = async ({ bot, i, lang, curr, server }: CommandExecuteProps) => {
  // defer the reply
  await bot.helpers.sendInteractionResponse(i.id, i.token, {
    type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    data: {
      flags: EphemeralFlag,
    },
  });

  const threadId = getChannelId(i, "thread");
  if (!threadId) return; // won't happen

  const guild = await getGuild(bot, i.guildId!);
  if (!guild) return; // won't happen

  const thread = await getChannel(bot, i.guildId!, threadId);
  if (!thread || !thread.parentId) return; // shouldn't ever happen

  const parentChannel = await getChannel(bot, i.guildId!, thread.parentId);
  if (!parentChannel) return; // shouldn't ever happen

  const parentId = parentChannel.id;

  const { details, hasPerms } = await hasPermsOnChannel(bot, parentChannel, guild, [
    "VIEW_CHANNEL",
    "MANAGE_WEBHOOKS",
    "SEND_MESSAGES_IN_THREADS",
    "EMBED_LINKS",
    ...(server?.roleId ? ["MENTION_EVERYONE" as PermissionStrings] : []), // check only if server has a set role
  ]);

  if (!hasPerms)
    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.UpdateMessage,
      data: {
        flags: EphemeralFlag,
        embeds: [embeds.errors.missingPermissions(parentId, lang, details)],
      },
    });

  const parentsWebhooks = await bot.helpers.getChannelWebhooks(parentId).catch((err) => {
    logger.error("error getting channels webhooks (thread):", err);
    return undefined;
  });

  if (!parentsWebhooks)
    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.UpdateMessage,
      data: {
        flags: EphemeralFlag,
        embeds: [embeds.errors.genericError()],
      },
    });

  let webhook = parentsWebhooks.find((webhook) => webhook.user?.id === bot.id);

  if (!webhook)
    webhook = await bot.helpers
      .createWebhook(parentId, {
        name: config.NAME_ON_WEBHOOK,
        avatar: config.LOGO_URL_ON_WEBHOOK,
        reason: "The free game notifications will be delivered via this webhook",
      })
      .catch((error) => {
        logger.error("failed creating a new webhook (thread):", error);
        return undefined;
      });

  if (!webhook)
    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.UpdateMessage,
      data: {
        flags: EphemeralFlag,
        embeds: [embeds.errors.genericError()],
      },
    });

  const { error, data: updatedServer } = await api<Server>({
    method: "PUT",
    path: `/servers/${i.guildId}/thread`,
    body: {
      channelId: String(parentId),
      threadId: String(threadId),
      webhookId: String(webhook.id),
      webhookToken: String(webhook.token),
    },
  });

  if (error)
    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.UpdateMessage,
      data: {
        flags: EphemeralFlag,
        embeds: [embeds.errors.genericError()],
      },
    });

  await bot.helpers.sendInteractionResponse(i.id, i.token, {
    type: InteractionResponseTypes.UpdateMessage,
    data: {
      flags: EphemeralFlag,
      embeds: [
        embeds.success.channelSet(threadId, lang),
        embeds.commands.settings(updatedServer, lang, curr),
      ],
    },
  });

  // send current free games to the set thread
  const { error: gameError, data: freeGames } = await api<Game[]>({
    method: "GET",
    path: "/games/free",
  });

  if (gameError || !freeGames.length) return;

  await executeWebhook(bot, {
    id: String(webhook.id),
    token: String(webhook.token),
    options: {
      embeds: freeGames.map((game) => embeds.games.gameEmbed(game, lang, curr)),
    },
    threadId: String(threadId),
  });
};
