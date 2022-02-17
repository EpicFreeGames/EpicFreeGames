import axios from "axios";
import { config, constants } from "config";
import {
  CommandTypes,
  db,
  embeds,
  logger,
  SlashCommand,
  SubCommandHandler,
  discordApiRequest,
} from "shared";
import { createWebhook, deleteWebhook, executeHook, hasWebhook } from "../utils/webhooks";

export const command: SlashCommand = {
  type: CommandTypes.MANAGE_GUILD,
  needsGuild: true,
  execute: async (i, guild, language) => {
    const subCommand = i.getSubCommand(true);

    if (subCommand?.name === "channel") return channelCommand(i, guild, language);
    if (subCommand?.name === "role") return roleCommand(i, guild, language);
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

const roleCommand: SubCommandHandler = async (i, guild, language) => {
  await i.deferReply({ ephemeral: true });

  if (!guild || !guild?.channelId)
    return i.editReply({ embeds: [embeds.errors.channelNotSet(language)], ephemeral: true });

  if (!(await userHasVoted(i.user.id)))
    return i.editReply({ embeds: [embeds.errors.mustVote(language)], ephemeral: true });

  const roleId = i.options.getRole("role", true);

  const role = await getRole(i.guildId!, roleId);
  const useful = makeSenseOfRole(role);

  const updatedGuild = await db.guilds.set.role(i.guildId!, useful.toDb);

  logger.discord({ embeds: [embeds.logs.roleSet(updatedGuild, i, useful.embed)] });
  await i.editReply({ embeds: [embeds.success.roleSet(useful.embed, language)], ephemeral: true });
};

const makeSenseOfRole = (role: any) => {
  if (role.name === "@everyone") return { embed: "@everyone", toDb: "1" };
  return { embed: `<@&${role.id}>`, toDb: role.id };
};

const userHasVoted = async (userId: string): Promise<boolean> => {
  try {
    const res = await axios.get(
      `https://top.gg/api/bots/${constants.userIds.prod}/check?userId=${userId}`,
      {
        headers: { Authorization: config.topGGAuth },
      }
    );

    if (res?.data) return res?.data?.voted === 1;

    return true;
  } catch (err: any) {
    console.log("topgg vote check failed", err?.message);
    return true;
  }
};

const getRole = async (guildId: string, roleId: string) => {
  const res = await axios(discordApiRequest(`/guilds/${guildId}/roles`, "GET"));

  return res?.data?.find((role: any) => role.id === roleId);
};
