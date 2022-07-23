import { Bot, DiscordGuild, Guild } from "discordeno";
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
      shardId: 123,
    });

  const result = await bot.rest.runMethod<DiscordGuild>(
    bot.rest,
    "GET",
    bot.constants.routes.GUILD(guildId, options.counts)
  );

  if (!result?.id) return undefined;

  return bot.transformers.guild(bot, {
    guild: result,
    shardId: 123,
  });
};
