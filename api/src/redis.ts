import { config } from "./config";
import connectRedis from "connect-redis";
import expressSession from "express-session";
import { createClient } from "redis";

export const createRedisStore = async () => {
  const RedisStore = connectRedis(expressSession);
  const redisClient = createClient({
    url: `redis://${config.REDISHOST}:${config.REDISPORT}`,
  });

  redisClient.on("error", (err) => console.log("REDIS ERROR:", err));

  return {
    store: new RedisStore({ client: redisClient }),
    client: redisClient,
  };
};
