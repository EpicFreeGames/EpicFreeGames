import { DiscordGuild } from "discordeno";
import { connect, Redis } from "redis";
import { config } from "~config";
import { deserialize, serialize } from "./utils/jsonWorker/initiator.ts";
import { logger } from "./utils/logger.ts";

export let redis: Redis | null = null;

export const connectRedis = async () => {
  if (redis) {
    return;
  }

  redis = await connect({
    hostname: config.REDISHOST,
    port: config.REDISPORT,
    password: config.REDISPASS,
    username: config.REDISUSER,
  });

  logger.info("Connected to Redis");
};

export const redisGet = async <TData>(key: string): Promise<TData | undefined> => {
  if (!redis) throw new Error("Not connected to Redis");

  try {
    const serializedData = await redis.get(key);

    if (!serializedData) return undefined;

    const data = await deserialize<TData>(serializedData);

    return data;
  } catch (err) {
    logger.error(err);

    return undefined;
  }
};

export const redisSet = async (
  key: string,
  // deno-lint-ignore no-explicit-any
  data: any
): Promise<boolean> => {
  if (!redis) throw new Error("Not connected to Redis");

  try {
    const serializedData = await serialize(data);

    await redis.set(key, serializedData);

    return true;
  } catch (err) {
    logger.error(err);

    return false;
  }
};

export const redisDelete = async (...keys: string[]): Promise<boolean> => {
  if (!redis) throw new Error("Not connected to Redis");

  try {
    await redis.unlink(...keys);

    return true;
  } catch (err) {
    logger.error(err);

    return false;
  }
};

export const redisGuildId = (guildId: bigint | string): string => `guild:${guildId}`;
export const redisChannelId = (guildId: bigint, channelId: bigint): string =>
  `channel:${guildId}/${channelId}`;

export const setGuildToCache = (guild: DiscordGuild): Promise<boolean> =>
  redisSet(redisGuildId(guild.id), guild);

export const getCachedGuild = (guildId: bigint): Promise<DiscordGuild | undefined> =>
  redisGet<DiscordGuild>(redisGuildId(guildId));
