import { InteractionResponseTypes, PermissionStrings } from "discordeno";
import { config } from "~config";
import { api } from "~shared/api.ts";
import { embeds } from "~shared/embeds/mod.ts";
import { Game, Server } from "~shared/types.ts";
import { getChannel } from "~shared/utils/getChannel.ts";
import { getGuild } from "~shared/utils/getGuild.ts";
import { hasPermsOnChannel } from "~shared/utils/hasPerms.ts";
import { logger } from "~shared/utils/logger.ts";
import { executeWebhook } from "~shared/utils/webhook.ts";
import { getChannelId } from "../../utils/interactionOptions.ts";
import { CommandExecuteProps, EphemeralFlag } from "../mod.ts";

export const setChannelCommand = async ({ bot, i, server, lang, curr }: CommandExecuteProps) => {
  await bot.helpers.sendInteractionResponse(i.id, i.token, {
    type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    data: {
      flags: EphemeralFlag,
    },
  });

  const channelId = getChannelId(i, "channel");
  if (!channelId) return; // won't happen, but just in case

  const channel = await getChannel(bot, i.guildId!, channelId);
  const guild = await getGuild(bot, i.guildId!);
  if (!channel || !guild) return; // won't happen, but just in case

  const { details, hasPerms } = await hasPermsOnChannel(bot, channel, guild, [
    "VIEW_CHANNEL",
    "MANAGE_WEBHOOKS",
    "EMBED_LINKS",
    ...(server?.roleId ? ["MENTION_EVERYONE" as PermissionStrings] : []), // check only if server has a set role
  ]);

  if (!hasPerms)
    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.UpdateMessage,
      data: {
        flags: EphemeralFlag,
        embeds: [embeds.errors.missingPermissions(channelId, lang, details)],
      },
    });

  const channelsWebhooks = await bot.helpers.getChannelWebhooks(channelId).catch((err) => {
    logger.error("error getting channels webhooks:", err);
    return undefined;
  });

  if (!channelsWebhooks)
    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.UpdateMessage,
      data: {
        flags: EphemeralFlag,
        embeds: [embeds.errors.genericError()],
      },
    });

  let webhook = channelsWebhooks.find((webhook) => webhook.user?.id === bot.id);

  if (!webhook)
    webhook = await bot.helpers
      .createWebhook(channelId, {
        name: config.NAME_ON_WEBHOOK,
        avatar: config.LOGO_URL_ON_WEBHOOK,
        reason: "The free game notifications will be delivered via this webhook",
      })
      .catch((error) => {
        logger.error("failed creating a new webhook:", error);
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
    path: `/servers/${i.guildId}/channel`,
    body: {
      channelId: String(channelId),
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
        embeds.success.channelSet(channelId, lang),
        embeds.commands.settings(updatedServer, lang, curr),
      ],
    },
  });

  // send current free games to the set channel
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
  });
};
