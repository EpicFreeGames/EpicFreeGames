import { config } from "./config";
import { initDatabaseDev } from "./data/init";
// @ts-ignore
import prisma from "./data/prisma";
// @ts-ignore
import redis from "./data/redis";
import { createServer } from "./server";

(async () => {
  const server = await createServer();

  if (config.ENV === "Development" && config.INITDB) await initDatabaseDev();

  const port = Number(process.env.PORT) || 3000;

  server.listen(port, () => console.log(`API listening on port ${port}`));
})();
