import { v4 as uuidv4 } from "uuid";

import redis from "../../data/redis";

export const getTokenId = (userId: string) => redis.get(`${userId}:token-id`);
export const setTokenId = (userId: string, id: string) => redis.set(`${userId}:token-id`, id);

export const randomizeTokenId = (userId: string) => redis.set(`${userId}:token-id`, uuidv4());

export const removeTokenId = (userId: string) => redis.del(`${userId}:token-id`);

export const isCorrectTokenId = async (userId: string, id: string) => {
  const tokenId = await redis.get(`${userId}:token-id`);

  return tokenId === id;
};
