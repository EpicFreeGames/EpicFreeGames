import {
  Bot,
  DiscordGuildRoleDelete,
  DiscordUnavailableGuild,
} from "discordeno";
import {
  getCachedGuild,
  redisDelete,
  redisGuildId,
  redisSet,
  setGuildToCache,
} from "../redis.ts";

export const handleCache = (bot: Bot): Bot => {
  // get unmodified transformers
  const { guild, role, channel } = bot.transformers;

  bot.transformers.guild = function (_, payload) {
    const result = guild(bot, payload);

    if (result) {
      setGuildToCache(payload.guild);
    }

    return result;
  };

  bot.transformers.role = function (bot, payload) {
    const result = role(bot, payload);

    if (result) {
      (async () => {
        const guild = await getCachedGuild(payload.guildId);
        if (guild) {
          if (!guild.roles.some((role) => role.id === payload.role.id)) {
            guild.roles.push({ ...payload.role });
            await redisSet(redisGuildId(result.guildId), guild);
          }
        }
      })();
    }

    return result;
  };

  bot.transformers.channel = function (bot, payload) {
    const result = channel(bot, payload);

    if (result) {
      (async () => {
        if (payload.channel.guild_id && result.guildId) {
          const guild = await getCachedGuild(
            bot.transformers.snowflake(payload.channel.guild_id)
          );

          if (guild) {
            guild.channels ??= [];

            const indexOfUpdatedChannel = guild.channels.findIndex(
              (channel) => channel.id === payload.channel.id
            );

            // if channel is found in cached guild, update it
            if (indexOfUpdatedChannel > 0) {
              guild.channels[indexOfUpdatedChannel] = { ...payload.channel };

              await setGuildToCache(guild);
            }
          }
        }
      })();
    }

    return result;
  };

  handleCacheRemovals(bot);
  return bot;
};

const handleCacheRemovals = (bot: Bot) => {
  // get unmodified handlers
  const { GUILD_DELETE, GUILD_ROLE_DELETE } = bot.handlers;

  bot.handlers.GUILD_DELETE = function (_, data, shardId) {
    const payload = data.d as DiscordUnavailableGuild;
    const id = bot.transformers.snowflake(payload.id);

    redisDelete(redisGuildId(id));

    GUILD_DELETE(bot, data, shardId);
  };

  bot.handlers.GUILD_ROLE_DELETE = function (_, data, shardId) {
    const payload = data.d as DiscordGuildRoleDelete;
    const guildId = bot.transformers.snowflake(payload.guild_id);

    (async () => {
      const guild = await getCachedGuild(guildId);

      if (guild) {
        guild.roles.filter((role) => role.id !== payload.role_id);

        await setGuildToCache(guild);
      }
    })();

    GUILD_ROLE_DELETE(bot, data, shardId);
  };
};
