import { InteractionResponseTypes } from "discordeno";
import { config } from "~config";
import { logger } from "~logger";
import { api } from "../../../api.ts";
import { embeds } from "../../../embeds/mod.ts";
import { Server } from "../../../types.ts";
import { getChannel } from "../../helpers/getChannel.ts";
import { getGuild } from "../../helpers/getGuild.ts";
import { hasPermsOnChannel } from "../../helpers/hasPerms.ts";
import { getChannelId } from "../../utils/interactionOptions.ts";
import { CommandExecuteProps } from "../mod.ts";

export const setChannelCommand = async ({
  bot,
  i,
  server,
  lang,
}: CommandExecuteProps) => {
  console.log({ lang });

  const channelId = getChannelId(i, "channel");
  if (!channelId) return; // won't happen, but just in case

  // first time setup
  if (!server?.channelId) {
    const channel = await getChannel(bot, i.guildId!, channelId);
    const guild = await getGuild(bot, i.guildId!);
    if (!channel || !guild) return; // won't happen, but just in case

    const { details, hasPerms } = await hasPermsOnChannel(bot, channel, guild, [
      "MANAGE_WEBHOOKS",
      "VIEW_CHANNEL",
    ]);

    if (!hasPerms)
      return await bot.helpers.sendInteractionResponse(i.id, i.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          embeds: [embeds.errors.missingPermissions(channelId, lang, details)],
        },
      });

    const channelsWebhooks = await bot.helpers
      .getChannelWebhooks(channelId)
      .catch((err) => {
        logger.error("error getting channels webhooks:", err);
        return undefined;
      });

    if (!channelsWebhooks)
      return await bot.helpers.sendInteractionResponse(i.id, i.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          embeds: [embeds.errors.genericError()],
        },
      });

    let webhook = channelsWebhooks.find(
      (webhook) => webhook.user?.id === bot.id
    );

    if (!webhook)
      webhook = await bot.helpers
        .createWebhook(channelId, {
          name: config.NAME_ON_WEBHOOK,
          avatar: config.BASE64_LOGO_ON_WEBHOOK,
          reason:
            "The free game notifications will be delivered via this webhook",
        })
        .catch((error) => {
          logger.error("failed creating a new webhook:", error);
          return undefined;
        });

    if (!webhook)
      return await bot.helpers.sendInteractionResponse(i.id, i.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
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
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          embeds: [embeds.errors.genericError()],
        },
      });

    return await bot.helpers.sendInteractionResponse(i.id, i.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        embeds: [
          embeds.success.channelSet(channelId, lang),
          embeds.commands.settings(updatedServer, lang),
        ],
      },
    });
  }
};
