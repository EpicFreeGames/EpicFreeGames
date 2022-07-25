import { Bot, DiscordChannel, DiscordGuildRoleDelete, DiscordUnavailableGuild } from "discordeno";
import { getCachedGuild, redisDelete, redisGuildId, redisSet, setGuildToCache } from "../redis.ts";

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
          const guild = await getCachedGuild(bot.transformers.snowflake(payload.channel.guild_id));

          if (guild) {
            guild.channels ??= [];

            const indexOfUpdatedChannel = guild.channels.findIndex(
              (channel) => channel.id === payload.channel.id
            );

            // if channel is found in cached guild, update it
            if (indexOfUpdatedChannel > 0) {
              guild.channels[indexOfUpdatedChannel] = { ...payload.channel };

              await setGuildToCache(guild);
            } else {
              // new channel, add to guild.channels
              guild.channels.push({ ...payload.channel });

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
  const { GUILD_DELETE, GUILD_ROLE_DELETE, CHANNEL_DELETE, THREAD_DELETE } = bot.handlers;

  bot.handlers.GUILD_DELETE = (_, data, shardId) => {
    const payload = data.d as DiscordUnavailableGuild;
    const id = bot.transformers.snowflake(payload.id);

    redisDelete(redisGuildId(id));

    GUILD_DELETE(bot, data, shardId);
  };

  bot.handlers.GUILD_ROLE_DELETE = (_, data, shardId) => {
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

  bot.handlers.CHANNEL_DELETE = (_, data, shardId) => {
    CHANNEL_DELETE(bot, data, shardId);

    const payload = data.d as DiscordChannel;
    if (!payload.guild_id) return;

    const guildId = bot.transformers.snowflake(payload.guild_id);

    (async () => {
      const guild = await getCachedGuild(guildId);

      if (guild && guild.channels) {
        guild.channels.filter((channel) => channel.id !== payload.id);
        await setGuildToCache(guild);
      }
    })();
  };

  bot.handlers.THREAD_DELETE = (_, data, shardId) => {
    THREAD_DELETE(bot, data, shardId);

    const payload = data.d as DiscordChannel;
    if (!payload.guild_id) return;

    const guildId = bot.transformers.snowflake(payload.guild_id);

    (async () => {
      const guild = await getCachedGuild(guildId);

      if (guild && guild.channels) {
        guild.channels.filter((channel) => channel.id !== payload.id);
        await setGuildToCache(guild);
      }
    })();
  };
};
