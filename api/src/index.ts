import { PrismaClient } from "@prisma/client";
import { config } from "./config";
import { createRedisStore } from "./redis";
import { createServer } from "./server";

export const prisma = new PrismaClient();

(async () => {
  await prisma.$connect();
  console.log("Connected to database");

  const { client, store } = await createRedisStore();
  await client.connect();
  console.log("Connected to Redis");

  const server = await createServer(store);

  server.listen(config.PORT, () =>
    console.log(`Listening on port ${config.PORT}`)
  );
})();
