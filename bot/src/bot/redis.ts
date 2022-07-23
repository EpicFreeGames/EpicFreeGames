import { DiscordGuild } from "discordeno";
import { redis } from "./mod.ts";
import { deserialize, serialize } from "./utils/jsonWorker/initiator.ts";

export const redisGet = async <TData>(
  key: string
): Promise<TData | undefined> => {
  try {
    const serializedData = await redis.get(key);

    if (!serializedData) return undefined;

    const data = await deserialize<TData>(serializedData);

    return data;
  } catch (err) {
    console.log(err);

    return undefined;
  }
};

export const redisSet = async (
  key: string,
  // deno-lint-ignore no-explicit-any
  data: any
): Promise<boolean> => {
  try {
    const serializedData = await serialize(data);

    await redis.set(key, serializedData);

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};

export const redisDelete = async (...keys: string[]): Promise<boolean> => {
  try {
    await redis.unlink(...keys);

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};

export const redisGuildId = (guildId: bigint | string): string =>
  `guild:${guildId}`;
export const redisChannelId = (guildId: bigint, channelId: bigint): string =>
  `channel:${guildId}/${channelId}`;

export const setGuildToCache = (guild: DiscordGuild): Promise<boolean> =>
  redisSet(redisGuildId(guild.id), guild);

export const getCachedGuild = (
  guildId: bigint
): Promise<DiscordGuild | undefined> =>
  redisGet<DiscordGuild>(redisGuildId(guildId));
