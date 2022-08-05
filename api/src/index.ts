import { config } from "./config";
// @ts-ignore
import prisma from "./prisma";
import { createRedisStore } from "./redis";
import { createServer } from "./server";

(async () => {
  const { client, store } = await createRedisStore();
  await client.connect();
  console.log("Connected to Redis");

  const server = await createServer(store);

  server.listen(config.PORT, () => console.log(`API listening on port ${config.PORT}`));
})();
