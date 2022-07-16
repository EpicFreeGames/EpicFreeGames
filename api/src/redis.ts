import { createClient } from "redis";
import connectRedis from "connect-redis";
import expressSession from "express-session";
import { config } from "./config";

export const createRedisStore = async () => {
  const RedisStore = connectRedis(expressSession);
  const redisClient = createClient({
    url: config.REDIS_URL,
  });

  redisClient.on("error", (err) => console.log("REDIS ERROR:", err));

  return {
    store: new RedisStore({ client: redisClient }),
    client: redisClient,
  };
};
