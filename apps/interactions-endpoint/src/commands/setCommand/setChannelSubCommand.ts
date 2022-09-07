import {
  APIApplicationCommandInteractionDataChannelOption,
  APIChatInputApplicationCommandGuildInteraction,
  ApplicationCommandOptionType,
  MessageFlags,
  RESTGetAPIChannelWebhooksResult,
  RESTPostAPIChannelWebhookJSONBody,
  RESTPostAPIChannelWebhookResult,
  RESTPostAPIWebhookWithTokenJSONBody,
} from "discord-api-types/v10";
import { Response } from "express";

import { botConstants, configuration } from "@efg/configuration";
import { embeds } from "@efg/embeds";
import { ICurrency, IGame, ILanguage, IServer, PermissionString } from "@efg/types";

import { discordApi } from "../../utils/discordApi/discordApi";
import { efgApi } from "../../utils/efgApi/efgApi";
import { interactionGetTypedOption } from "../../utils/interactions/interactionGetTypedOption";
import { interactionDeferReply } from "../../utils/interactions/responding/interactionDeferReply";
import { interactionEditReply } from "../../utils/interactions/responding/interactionEditReply";
import { hasPermsOnChannel } from "../../utils/perms/hasPermsOnChannel";
import { getRole } from "./_utils";

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

  const { details, error, hasPerms } = await hasPermsOnChannel(i.guild_id, selectedChannelId, [
    "VIEW_CHANNEL",
    "MANAGE_WEBHOOKS",
    "EMBED_LINKS",
    ...(server?.roleId ? ["MENTION_EVERYONE" as PermissionString] : []),
  ]);

  if (error) return await interactionEditReply(i.token, { embeds: [embeds.errors.genericError()] });

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
    console.error(
      `Failed to set channel - Cause: Failed to get webhooks for channel - Cause:\n${channelsWebhooksError}\nChannel ID: ${selectedChannelId}\nGuild ID: ${i.guild_id}`
    );
    return await interactionEditReply(i.token, {
      embeds: [embeds.errors.genericError()],
      flags: MessageFlags.Ephemeral,
    });
  }

  // remove the previous webhook if new channel !== old channel
  if (server?.webhookId && server?.webhookToken && server?.channelId !== String(selectedChannelId))
    await discordApi({
      method: "DELETE",
      path: `/webhooks/${server.webhookId}/${server.webhookToken}`,
    });

  let webhook = channelsWebhooks.find(
    (webhook) => webhook.user?.id === String(configuration.DISCORD_BOT_ID)
  );

  if (!webhook) {
    if (channelsWebhooks.length >= 10) {
      console.error(
        `Failed to set channel - Cause: Max number of webhooks\nChannel ID: ${selectedChannelId}\nGuild ID: ${i.guild_id}`
      );

      return await interactionEditReply(i.token, {
        embeds: [embeds.errors.maxNumOfWebhooks(language)],
        flags: MessageFlags.Ephemeral,
      });
    }

    const { data: newWebhook, error: newWebhookError } =
      await discordApi<RESTPostAPIChannelWebhookResult>({
        method: "POST",
        path: `/channels/${selectedChannelId}/webhooks`,
        body: {
          name: botConstants.webhookName,
          avatar: await botConstants.base64Logo(),
        } as RESTPostAPIChannelWebhookJSONBody,
      });

    if (newWebhookError) {
      console.error(
        `Failed to set channel - Cause:\n${channelsWebhooksError}\nChannel ID: ${selectedChannelId}\nGuild ID: ${i.guild_id}`
      );
      return await interactionEditReply(i.token, {
        embeds: [embeds.errors.genericError()],
        flags: MessageFlags.Ephemeral,
      });
    }

    webhook = newWebhook;
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
    console.error(
      `Failed to save updated webhook to efgApi - Cause:\n${updatedServerError}\nChannel ID: ${selectedChannelId}\nGuild ID: ${i.guild_id}`
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
  const { error: gameError, data: freeGames } = await efgApi<IGame[]>({
    method: "GET",
    path: "/games/free",
  });

  if (gameError || !freeGames.length) return;

  await discordApi({
    method: "POST",
    path: `/webhooks/${webhook.id}/${webhook.token}`,
    body: {
      ...(updatedServer.roleId ? { content: getRole(updatedServer.roleId) } : {}),
      embeds: [freeGames.map((g) => embeds.games.game(g, language, currency))],
    } as RESTPostAPIWebhookWithTokenJSONBody,
  });
};
