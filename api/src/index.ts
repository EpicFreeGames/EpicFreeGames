import { config } from "./config";
import { createRedisStore } from "./redis";
import { createServer } from "./server";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

(async () => {
  await prisma.$connect();
  console.log("Connected to database");

  const { client, store } = await createRedisStore();
  await client.connect();
  console.log("Connected to Redis");

  const server = await createServer(store);

  server.listen(config.PORT, () => console.log(`API listening on port ${config.PORT}`));
})();
