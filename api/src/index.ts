import { config } from "./config";
// @ts-ignore
import prisma from "./prisma";
// @ts-ignore
import redis from "./redis";
import { createServer } from "./server";

(async () => {
  const server = await createServer();

  server.listen(config.PORT, () => console.log(`API listening on port ${config.PORT}`));
})();
