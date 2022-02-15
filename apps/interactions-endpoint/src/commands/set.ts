import { CommandTypes, db, embeds, logger, SlashCommand, SubCommandHandler } from "shared";
import { createWebhook, deleteWebhook, executeHook, hasWebhook } from "../utils/webhooks";

export const command: SlashCommand = {
  type: CommandTypes.MANAGE_GUILD,
  needsGuild: true,
  execute: async (i, guild, language) => {
    const subCommand = i.getSubCommand(true);

    if (subCommand?.name === "channel") return channelCommand(i, guild, language);
  },
};

const channelCommand: SubCommandHandler = async (i, guild, language) => {
  await i.deferReply({ ephemeral: true });
  const channelId = i.options.getChannelId("channel", true);

  let newChannelsHook = await hasWebhook(channelId).catch((err: any) => err.message);

  // 50013 = Missing permissions | 50001 = Missing access
  if (newChannelsHook === "50013" || newChannelsHook === "50001")
    return i.editReply({ embeds: [embeds.errors.missingPermissions(channelId, language)] });

  if (guild?.webhook && guild?.channelId !== channelId)
    await deleteWebhook(guild.webhook).catch((err: any) => db.guilds.remove.webhook(i.guildId!));

  newChannelsHook ??= await createWebhook(channelId).catch((err: any) => err.message);

  if (!newChannelsHook) return i.editReply({ embeds: [embeds.errors.genericError()] });

  if (newChannelsHook === "50013" || newChannelsHook === "50001")
    return i.editReply({ embeds: [embeds.errors.missingPermissions(channelId, language)] });

  // 30007 = Maximum number of webhooks reached (10)
  if (newChannelsHook === "30007")
    return i.editReply({ embeds: [embeds.errors.maxNumberOfWebhooks(language)] });

  const updatedGuild = await db.guilds.set.webhook(i.guildId!, newChannelsHook, channelId);

  logger.discord({ embeds: [embeds.logs.channelSet(updatedGuild, i, channelId)] });

  await i.editReply({ embeds: [embeds.success.channelSet(channelId, language)] });

  // send current free games to the newly set channel
  await executeHook(newChannelsHook, {
    embeds: embeds.games.games(await db.games.get.free(), language),
  });
};
