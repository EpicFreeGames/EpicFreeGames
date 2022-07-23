import { Bot, Channel, DiscordChannel } from "discordeno";
import { getCachedGuild } from "../redis.ts";

export const getChannel = async (
  bot: Bot,
  guildId: bigint,
  channelId: bigint
): Promise<Channel | undefined> => {
  const fromCache = await getCachedGuild(guildId);

  const channel = fromCache?.channels?.find((c) => c.id === String(channelId));
  if (channel) return bot.transformers.channel(bot, { channel, guildId });

  const result = await bot.rest.runMethod<DiscordChannel>(
    bot.rest,
    "GET",
    bot.constants.routes.CHANNEL(channelId)
  );

  return result?.id
    ? bot.transformers.channel(bot, {
        channel: result,
        guildId: result.guild_id
          ? bot.transformers.snowflake(result.guild_id)
          : undefined,
      })
    : undefined;
};
