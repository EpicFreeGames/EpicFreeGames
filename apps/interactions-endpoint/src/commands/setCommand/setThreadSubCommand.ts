import {
  APIApplicationCommandAutocompleteGuildInteraction,
  APIApplicationCommandInteractionDataChannelOption,
  APIChatInputApplicationCommandGuildInteraction,
  ApplicationCommandOptionType,
  ChannelType,
  MessageFlags,
  RESTGetAPIChannelResult,
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

export const setThreadSubCommand = async (
  {
    i,
    server,
    language,
    currency,
  }: {
    i:
      | APIChatInputApplicationCommandGuildInteraction
      | APIApplicationCommandAutocompleteGuildInteraction;
    server?: IServer;
    language: ILanguage;
    currency: ICurrency;
  },
  res: Response
) => {
  interactionDeferReply(res, { ephemeral: true });

  const threadOption = interactionGetTypedOption<APIApplicationCommandInteractionDataChannelOption>(
    i,
    ApplicationCommandOptionType.Channel,
    "channel"
  );
  if (!threadOption) return;

  const selectedThreadId = BigInt(threadOption.value);

  const { data: thread, error: threadError } = await discordApi<RESTGetAPIChannelResult>({
    method: "GET",
    path: `/channels/${selectedThreadId}`,
  });

  if (threadError)
    return await interactionEditReply(i.token, { embeds: [embeds.errors.genericError()] });

  if (!thread) {
    console.error(
      `Failed to set thread - Cause: Thread not found\nThread ID: ${selectedThreadId}\nGuild ID: ${i.guild_id}`
    );

    return await interactionEditReply(i.token, { embeds: [embeds.errors.genericError()] });
  }

  if (thread.type !== ChannelType.PublicThread) {
    console.error(
      `Failed to set thread - Cause: ChannelType is not PublicThread\nThread ID: ${selectedThreadId}\nGuild ID: ${i.guild_id}`
    );

    return await interactionEditReply(i.token, { embeds: [embeds.errors.genericError()] });
  }

  if (!thread.parent_id) {
    console.error(
      `Failed to set thread - Cause: thread_id is not defined\nThread ID: ${selectedThreadId}\nGuild ID: ${i.guild_id}`
    );

    return await interactionEditReply(i.token, { embeds: [embeds.errors.genericError()] });
  }

  const threadParentId = BigInt(thread.parent_id);

  const { details, hasPerms, error } = await hasPermsOnChannel(i.guild_id, threadParentId, [
    "VIEW_CHANNEL",
    "MANAGE_WEBHOOKS",
    "SEND_MESSAGES_IN_THREADS",
    "EMBED_LINKS",
    ...(server?.roleId ? ["MENTION_EVERYONE" as PermissionString] : []), // check only if server has a set role
  ]);

  if (error) {
    console.error(
      `Failed to set thread - Cause: hasPermsOnChannel failed\nThread ID: ${selectedThreadId}\nThread parent ID: ${threadParentId}\nGuild ID: ${i.guild_id}`
    );

    return await interactionEditReply(i.token, { embeds: [embeds.errors.genericError()] });
  }

  if (hasPerms === false)
    return await interactionEditReply(i.token, {
      embeds: [embeds.errors.missingPermissions(threadParentId, language, details)],
      flags: MessageFlags.Ephemeral,
    });

  const { data: parentChannelsWebhooks, error: parentChannelsWebhooksError } =
    await discordApi<RESTGetAPIChannelWebhooksResult>({
      method: "GET",
      path: `/channels/${threadParentId}/webhooks`,
    });

  if (parentChannelsWebhooksError) {
    console.error(
      `Failed to set thread - Cause: Failed to get webhooks for channel - Cause:\n${parentChannelsWebhooksError}\nThread ID: ${selectedThreadId}\nThread parent ID: ${threadParentId}\nGuild ID: ${i.guild_id}`
    );
    return await interactionEditReply(i.token, {
      embeds: [embeds.errors.genericError()],
      flags: MessageFlags.Ephemeral,
    });
  }

  // remove the previous webhook if new channel !== old channel
  if (server?.webhookId && server?.webhookToken && server?.channelId !== String(threadParentId))
    await discordApi({
      method: "DELETE",
      path: `/webhooks/${server.webhookId}/${server.webhookToken}`,
    });

  let webhook = parentChannelsWebhooks.find(
    (webhook) => webhook.user?.id === String(configuration.DISCORD_BOT_ID)
  );

  if (!webhook) {
    if (parentChannelsWebhooks.length >= 10) {
      console.error(
        `Failed to set thread - Cause: Max number of webhooks\nThread ID: ${selectedThreadId}\nThread parent ID: ${threadParentId}\nGuild ID: ${i.guild_id}`
      );

      return await interactionEditReply(i.token, {
        embeds: [embeds.errors.maxNumOfWebhooks(language)],
        flags: MessageFlags.Ephemeral,
      });
    }

    const { data: newWebhook, error: newWebhookError } =
      await discordApi<RESTPostAPIChannelWebhookResult>({
        method: "POST",
        path: `/channels/${threadParentId}/webhooks`,
        body: {
          name: botConstants.webhookName,
          avatar: await botConstants.base64Logo(),
        } as RESTPostAPIChannelWebhookJSONBody,
      });

    if (newWebhookError) {
      console.error(
        `Failed to set thread - Cause: Couldn't create a new webhook - Cause:\n${newWebhookError}\nThread ID: ${selectedThreadId}\nThread parent ID: ${threadParentId}\nGuild ID: ${i.guild_id}`
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
      channelId: String(threadParentId),
      threadId: String(selectedThreadId),
      webhookId: String(webhook.id),
      webhookToken: String(webhook.token),
    },
  });

  if (updatedServerError) {
    console.error(
      `Failed to set thread - Cause: Failed to save updated webhook to efgApi - Cause:\n${updatedServerError}\nThread ID: ${selectedThreadId}\nThread parent ID: ${threadParentId}\nGuild ID: ${i.guild_id}`
    );

    return await interactionEditReply(i.token, {
      embeds: [embeds.errors.genericError()],
      flags: MessageFlags.Ephemeral,
    });
  }

  await interactionEditReply(i.token, {
    embeds: [
      embeds.successes.channelSet(threadParentId, language),
      embeds.commands.settings(updatedServer, language, currency),
    ],
    flags: MessageFlags.Ephemeral,
  });

  // send current free games to the set thread
  const { error: gameError, data: freeGames } = await efgApi<IGame[]>({
    method: "GET",
    path: "/games/free",
  });

  if (gameError || !freeGames.length) return;

  await discordApi({
    method: "POST",
    path: `/webhooks/${webhook.id}/${webhook.token}?thread_id=${selectedThreadId}`,
    body: {
      ...(updatedServer.roleId ? { content: getRole(updatedServer.roleId) } : {}),
      embeds: [freeGames.map((g) => embeds.games.game(g, language, currency))],
    } as RESTPostAPIWebhookWithTokenJSONBody,
  });
};