import {
  APIApplicationCommandInteractionDataChannelOption,
  APIChatInputApplicationCommandGuildInteraction,
  ApplicationCommandOptionType,
  MessageFlags,
  RESTGetAPIChannelWebhooksResult,
} from "discord-api-types/v10";
import { Response } from "express";

import { botConstants, configuration } from "@efg/configuration";
import { embeds } from "@efg/embeds";
import { logger } from "@efg/logger";
import {
  createDiscordWebhook,
  deleteDiscordWebhook,
  discordApi,
  displayRole,
  efgApi,
  executeDiscordWebhook,
  objToStr,
} from "@efg/shared-utils";
import { ICurrency, IGameWithStuff, ILanguage, IServer, PermissionString } from "@efg/types";

import { interactionGetTypedOption } from "../../utils/interactions/interactionGetTypedOption";
import { interactionDeferReply } from "../../utils/interactions/responding/interactionDeferReply";
import { interactionEditReply } from "../../utils/interactions/responding/interactionEditReply";
import { hasPermsOnChannel } from "../../utils/perms/hasPermsOnChannel";

export const setChannelSubCommand = async (
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

  const channelOption =
    interactionGetTypedOption<APIApplicationCommandInteractionDataChannelOption>(
      i,
      ApplicationCommandOptionType.Channel,
      "channel"
    );
  if (!channelOption) return;

  const selectedChannelId = BigInt(channelOption.value);

  const { details, error, cause, hasPerms } = await hasPermsOnChannel(
    i.guild_id,
    selectedChannelId,
    [
      "VIEW_CHANNEL",
      "MANAGE_WEBHOOKS",
      "EMBED_LINKS",
      ...(server?.roleId ? ["MENTION_EVERYONE" as PermissionString] : []),
    ]
  );

  if (error) {
    logger.error(
      [
        "Failed to set channel",
        "Cause: Failed to check bot's permissions on channel",
        `Cause: ${cause}`,
        `Channel ID: ${selectedChannelId}`,
        `Guild ID: ${i.guild_id}`,
      ].join("\n")
    );

    return await interactionEditReply(i.token, { embeds: [embeds.errors.genericError()] });
  }

  if (hasPerms === false)
    return await interactionEditReply(i.token, {
      embeds: [embeds.errors.missingPermissions(selectedChannelId, language, details)],
      flags: MessageFlags.Ephemeral,
    });

  const { data: channelsWebhooks, error: channelsWebhooksError } =
    await discordApi<RESTGetAPIChannelWebhooksResult>({
      method: "GET",
      path: `/channels/${selectedChannelId}/webhooks`,
    });

  if (channelsWebhooksError) {
    logger.error(
      [
        "Failed to set channel",
        "Cause: Failed to get webhooks for channel",
        `Cause: ${objToStr(channelsWebhooksError)}`,
        `Channel ID: ${selectedChannelId}`,
        `Guild ID: ${i.guild_id}`,
      ].join("\n")
    );

    return await interactionEditReply(i.token, {
      embeds: [embeds.errors.genericError()],
      flags: MessageFlags.Ephemeral,
    });
  }

  // delete the previous webhook if new channel !== old channel
  if (server?.webhookId && server?.webhookToken && server?.channelId !== String(selectedChannelId))
    await deleteDiscordWebhook({
      webhookId: server.webhookId,
      webhookToken: server.webhookToken,
    });

  let webhook = channelsWebhooks.find(
    (webhook) => webhook.user?.id === String(configuration.DISCORD_BOT_ID)
  );

  if (!webhook) {
    if (channelsWebhooks.length >= 10) {
      logger.error(
        [
          "Failed to set channel",
          "Cause: Max number of webhooks",
          `Channel ID: ${selectedChannelId}`,
          `Guild ID: ${i.guild_id}`,
        ].join("\n")
      );

      return await interactionEditReply(i.token, {
        embeds: [embeds.errors.maxNumOfWebhooks(language)],
        flags: MessageFlags.Ephemeral,
      });
    }

    const { data: newWebhook, error: newWebhookError } = await createDiscordWebhook({
      channelId: String(selectedChannelId),
      body: {
        name: botConstants.webhookName,
        avatar: botConstants.base64Logo,
      },
    });

    if (newWebhookError) {
      logger.error(
        [
          "Failed to set channel",
          "Cause: Failed to create webhook",
          `Cause: ${objToStr(newWebhookError)}`,
          `Channel ID: ${selectedChannelId}`,
          `Guild ID: ${i.guild_id}`,
        ].join("\n")
      );

      return await interactionEditReply(i.token, {
        embeds: [embeds.errors.genericError()],
        flags: MessageFlags.Ephemeral,
      });
    }

    webhook = newWebhook;
  }

  if (!webhook.token) {
    logger.error(
      [
        "Failed to set channel",
        "Cause: Returned webhook didn't have a token",
        `Channel ID: ${selectedChannelId}`,
        `Guild ID: ${i.guild_id}`,
      ].join("\n")
    );

    return await interactionEditReply(i.token, {
      embeds: [embeds.errors.genericError()],
      flags: MessageFlags.Ephemeral,
    });
  }

  const { error: updatedServerError, data: updatedServer } = await efgApi<IServer>({
    method: "PUT",
    path: `/servers/${i.guild_id}/channel`,
    body: {
      channelId: String(selectedChannelId),
      webhookId: String(webhook.id),
      webhookToken: String(webhook.token),
    },
  });

  if (updatedServerError) {
    logger.error(
      [
        "Failed to set channel",
        "Cause: Failed to save updated webhook to efgApi",
        `Cause: ${objToStr(updatedServerError)}`,
        `Channel ID: ${selectedChannelId}`,
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
      embeds.successes.channelSet(selectedChannelId, language),
      embeds.commands.settings(updatedServer, language, currency),
    ],
    flags: MessageFlags.Ephemeral,
  });

  // send current free games to the set channel
  const { error: gameError, data: freeGames } = await efgApi<IGameWithStuff[]>({
    method: "GET",
    path: "/games/free",
  });

  if (gameError || !freeGames.length) return;

  await executeDiscordWebhook({
    webhookId: webhook.id,
    webhookToken: webhook.token,
    body: {
      ...(updatedServer.roleId ? { content: displayRole(updatedServer.roleId) } : {}),
      embeds: freeGames.map((g) => embeds.games.game(g, language, currency)),
    },
  });
};
