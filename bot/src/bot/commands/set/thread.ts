import { InteractionResponseTypes, PermissionStrings } from "discordeno";
import { config } from "~config";
import { api } from "~shared/api.ts";
import { embeds } from "~shared/embeds/mod.ts";
import { Game, Server } from "~shared/types.ts";
import { getChannel } from "~shared/utils/getChannel.ts";
import { getGuild } from "~shared/utils/getGuild.ts";
import { hasPermsOnChannel } from "~shared/utils/hasPerms.ts";
import { logger } from "~shared/utils/logger.ts";
import { createWebhook, executeWebhook, removeWebhook } from "~shared/utils/webhook.ts";
import { botConstants } from "../../../_shared/constants.ts";
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

  // remove the previous webhook if new channel !== old channel
  if (server?.webhookId && server?.webhookToken && server?.channelId !== String(parentId))
    removeWebhook(server.webhookId, server.webhookToken);

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

  if (!webhook) {
    if (parentsWebhooks.size === 10)
      return await bot.helpers.sendInteractionResponse(i.id, i.token, {
        type: InteractionResponseTypes.UpdateMessage,
        data: {
          flags: EphemeralFlag,
          embeds: [embeds.errors.maxNumberOfWebhooks(lang)],
        },
      });

    const { error, data } = await createWebhook(bot, parentId, {
      name: botConstants.webhookName(false),
      avatar: config.BASE64_LOGO,
      reason: "The free game notifications will be delivered via this webhook",
    });

    if (error)
      return await bot.helpers.sendInteractionResponse(i.id, i.token, {
        type: InteractionResponseTypes.UpdateMessage,
        data: {
          flags: EphemeralFlag,
          embeds: [embeds.errors.genericError()],
        },
      });

    webhook = data;
  }

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
