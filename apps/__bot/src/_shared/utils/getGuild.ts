import { Bot, DiscordGuild, Guild, calculateShardId } from "discordeno";

import { getCachedGuild } from "../redis.ts";

export const getGuild = async (
  bot: Bot,
  guildId: bigint,
  options: { counts?: boolean } = {
    counts: true,
  }
): Promise<Guild | undefined> => {
  const fromCache = await getCachedGuild(guildId);
  if (fromCache)
    return bot.transformers.guild(bot, {
      guild: fromCache,
      shardId: calculateShardId(bot.gateway, guildId),
    });

  const result = await bot.rest.runMethod<DiscordGuild>(
    bot.rest,
    "GET",
    bot.constants.routes.GUILD(guildId, options.counts)
  );

  if (!result?.id) return undefined;

  return bot.transformers.guild(bot, {
    guild: result,
    shardId: calculateShardId(bot.gateway, guildId),
  });
};
